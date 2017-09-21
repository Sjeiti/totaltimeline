/**
 * Component showing entry content
 * @module content
 */

import {create} from './component'
import {stringToElement,clearChildren} from '../util'
import model from '../model'
import style from '../style'
import {formatAnnum} from '../time'
import collections from '../collections'

const writable = true

export default create(
  'data-content'
  ,{
    init(element){
      const that = this
        //
        ,visibleRange = model.range
        ,classNameReveal = 'reveal'
        ,contentStyle = style.select('[data-content]')
        ,elmContentWrapper = stringToElement('<div class="content"></div>')
        ,fragment = document.createDocumentFragment()
        ,flexGrowPrefixes = {
          '-webkit-flex-grow': 1
          ,'-moz-flex-grow': 1
          ,'-ms-flex-grow': 1
          ,'flex-grow': 1
        }

      // Initialise event listeners (and signals).
      model.entryShown.add(onEntryShown)
      element.addEventListener('scroll',onContentScroll)
      // resize.add(onContentScroll)

      // Initialise view
      element.appendChild(elmContentWrapper)

      // close view
      element.addEventListener('click',({target})=>{
        target.nodeName==='BUTTON'&&model.entryShown.dispatch()
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
            if (!visibleRange.coincides(entry.moment)&&animateIfNeeded) {
              // zoom the entry with to n-closest entries
              const range = collections.getEntryRange(entry, 2, 2)
                ,{entryShown} = model
              range && visibleRange.animate(...range).then(entryShown.dispatch.bind(entryShown, entry, false))
            }
          } else if (entry.range) {
            time = `${formatAnnum(entry.range.start.ago,2,true,true)} to ${formatAnnum(entry.range.end.ago,2,true,true)}`
          }
          elmContentWrapper.classList.add(classNameReveal)
          setTimeout(()=>elmContentWrapper.classList.remove(classNameReveal))

          clearChildren(elmContentWrapper)
            .appendChild(createContent(
              info.name
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
          ,scrollHeight = element.scrollHeight
          ,height = element.offsetHeight
          ,isSameHeight = height===scrollHeight
        let fPart
        if (isSameHeight&&flexGrowPrefixes['flex-grow']!==1) {
          fPart = 1
        } else if (isSameHeight) {
          fPart = 0
        } else {
          fPart = scrollTop/(scrollHeight-height)
        }
        setContentGrow(1+fPart*2); // todo: get that 1 from less
      }

      /**
       * Set flexbox grow value
       * @param {number} value
       */
      function setContentGrow(value){
        for (let s in flexGrowPrefixes) {
          flexGrowPrefixes[s] = value
        }
        contentStyle.set(flexGrowPrefixes)
      }

      /**
       * Create the content for and event
       * @param {string} name
       * @param {string} time
       * @param {string} img
       * @param {string} text
       * @param {string} wikimediakey
       * @returns {HTMLElement}
       */
      function createContent(name,time,img,text,wikimediakey){
        return stringToElement(`<article>
          <header>
            <h3>${name}</h3>
            <time>${time}</time>
            <button>&#215;</button>
          </header>
          <img src="${img}"/>
          ${text}
          ${wikimediakey&&`<footer><a target="wikipedia" href="https://wikipedia.org/wiki/{url.split(':')[0]}">wikipedia</a></footer>`||''}
        </article>`)
      }

    }
  }
  ,{
    currentEntry: {writable}
  }
)