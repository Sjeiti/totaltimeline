/**
 * Component showing entry content
 * @module content
 */

import {create} from './component'
import {getFragment,clearChildren} from '../util'
import model from '../model'
import resize from '../signal/resize'
import style from '../style'
import tmpl from '../tmpl'

const writable = true

create(
  'data-content'
  ,{
    init(){
      const that = this
        //
        ,visibleRange = model.range
        ,elmContent = this.element
        ,contentStyle = style.select('#content')
        ,elmContentWrapper = getFragment('<div class="content"></div>').firstChild
        ,fragment = document.createDocumentFragment()
        ,flexGrowPrefixes = {
          '-webkit-box-flex': 1
          ,'-moz-box-flex': 1
          ,'-webkit-flex-grow': 1
          ,'-moz-flex-grow': 1
          ,'-ms-flex-grow': 1
          ,'flex-grow': 1
        }

      // Initialise event listeners (and signals).
      model.entryShown.add(onEntryShown)
      elmContent.addEventListener('scroll',onContentScroll)
      resize.add(onContentScroll)

      // Initialise view
      elmContent.appendChild(elmContentWrapper)

      elmContent.addEventListener('click',({target})=>{
        target.nodeName==='BUTTON'&&model.entryShown.dispatch()
      })

      /**
       * Show the content of the entry
       * @param {collectionEntry} entry
       */
      function onEntryShown(entry) {
        that.currentEntry = entry
        clearChildren(elmContentWrapper)
        clearChildren(fragment)
        setContentGrow(1)
        elmContent.scrollTop = 0
        if (entry) {
          let time = ''
          if (entry.moment) {
            time = entry.moment.toString()
            // scroll if entry is not within view
            if (!visibleRange.coincides(entry.moment)) {
              const iAgo = entry.moment.ago
                ,iDuration = visibleRange.duration
                ,iNewStart = iAgo + iDuration/2
                ,iNewEnd = iAgo - iDuration/2
              // have to add callback because animation immediately cancels content entry
              visibleRange.animate(iNewStart,iNewEnd,onEntryShown.bind(null,entry))
            }
          } else if (entry.range) {
            time = entry.range.start.toString()+' - '+entry.range.end.toString()
          }
          elmContentWrapper.classList.add('hide')
          setTimeout(()=>elmContentWrapper.classList.remove('hide'))
          elmContentWrapper.innerHTML = tmpl('content_tmpl',Object.assign(entry,{
            time: time
          }))
        }
      }

      /**
       * Change the vertical proportions when scrolling
       */
      function onContentScroll(){
        const scrollTop = elmContent.scrollTop
          ,scrollHeight = elmContent.scrollHeight
          ,height = elmContent.offsetHeight
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
    }
  }
  ,{
    currentEntry: {writable}
  }
)
