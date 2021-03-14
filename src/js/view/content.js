/**
 * Component showing entry content
 * @module content
 */

import {create} from './component'
import {stringToElement,clearChildren} from '../util'
import {currentRange, entryShown, editEvent, api} from '../model'
import {select} from '../style'
import {formatAnnum} from '../time'
import {collections} from '../collections'

const writable = true

export const content = create(
  'data-content'
  ,{
    init(element){
      const that = this
      //
      const classNameReveal = 'reveal'
      const contentStyle = select('[data-content]')
      const elmContentWrapper = stringToElement('<div class="content"></div>')
      const fragment = document.createDocumentFragment()
      const flexGrowPrefixes = {
        '-webkit-flex-grow': 1
        ,'-moz-flex-grow': 1
        ,'-ms-flex-grow': 1
        ,'flex-grow': 1
      }

      // Initialise event listeners (and signals).
      entryShown.add(onEntryShown)
      element.addEventListener('scroll',onContentScroll)
      // resize.add(onContentScroll)

      // Initialise view
      element.appendChild(elmContentWrapper)

      // close view
      element.addEventListener('click',({target})=>{
        if (target.nodeName==='BUTTON') {
          target.hasAttribute('data-close')&&entryShown.dispatch()
          target.hasAttribute('data-edit')&&editEvent.dispatch(this.currentEntry)
        }
      })

      /**
       * Show the content of the entry
       * @param {collectionEntry} entry
       * @param {boolean} [animateIfNeeded=true]
       */
      function onEntryShown(entry, animateIfNeeded=true) {
        that.currentEntry = entry
        clearChildren(elmContentWrapper)
        clearChildren(fragment)
        setContentGrow(entry&&1||0)
        element.scrollTop = 0
        if (entry) {
          const {info} = entry
          let time = ''
          if (entry.moment) {
            time = formatAnnum(entry.moment.ago,2,true,true)
            // scroll if entry is not within view
            if (!currentRange.coincides(entry.moment)&&animateIfNeeded) {
              // zoom the entry with to n-closest entries
              const range = collections.getEntryRange(entry, 2, 2)
              range && currentRange.animate(...range).then(entryShown.dispatch.bind(entryShown, entry, false))
            }
          } else if (entry.range) {
            time = `${formatAnnum(entry.range.start.ago,2,true,true)} to ${formatAnnum(entry.range.end.ago,2,true,true)}`
          }
          elmContentWrapper.classList.add(classNameReveal)
          setTimeout(()=>elmContentWrapper.classList.remove(classNameReveal))

          clearChildren(elmContentWrapper)
            .appendChild(createContent(
              info.name
              ,info.slug
              ,time
              ,info.thumb
              ,info.explanation||info.wikimedia
              ,info.wikimediakey
            ))
        }
      }

      /**
       * Change the vertical proportions when scrolling
       */
      function onContentScroll(){
        const scrollTop = element.scrollTop
        const scrollHeight = element.scrollHeight
        const height = element.offsetHeight
        const isSameHeight = height===scrollHeight
        let part
        if (isSameHeight&&flexGrowPrefixes['flex-grow']!==1) {
          part = 1
        } else if (isSameHeight) {
          part = 0
        } else {
          part = scrollTop/(scrollHeight-height)
        }
        setContentGrow(1+part*2) // todo: get that 1 from less
      }

      /**
       * Set flexbox grow value
       * @param {number} value
       */
      function setContentGrow(value){
        Object.keys(flexGrowPrefixes).forEach(key=>{
          flexGrowPrefixes[key] = value
        })
        contentStyle.set(flexGrowPrefixes)
      }

      /**
       * Create the content for and event
       * @param {string} name
       * @param {string} slug
       * @param {string} time
       * @param {string} img
       * @param {string} text
       * @param {string} wikimediakey
       * @returns {HTMLElement}
       */
      function createContent(name,slug,time,img,text,wikimediakey){
        return stringToElement(`<article class="article-${slug}">
          <header>
            <h3>${name}</h3>
            <time>${time}</time>
            <button class="icn-cross" data-close></button>
            ${api.exists?'<button class="icn-pencil" data-edit></button>':''}
          </header>
          <img alt="${name}" src="${img}"/>
          ${text}
          ${wikimediakey&&`<footer><a target="wikipedia" href="https://wikipedia.org/wiki/${wikimediakey.split(':')[0]}">wikipedia</a></footer>`||''}
        </article>`)
      }

    }
  }
  ,{
    currentEntry: {writable}
  }
)