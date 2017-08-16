
import {create} from './component'
import {getFragment,clearChildren} from '../util'
import model from '../model'
import resize from '../signal/resize'
import event from '../collection/event'
import style from '../style'
import tmpl from '../tmpl'

const writable = true

create(
  'data-content'
  ,{
    init(){
      ////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////
      const that = this
        ,period = {}
        //
        ,oRange = model.range
        ,mContent = this.element
        ,oContentStyle = style.select('#content')
        ,mContentWrapper = getFragment('<div class="content"></div>').firstChild
        ,mFragment = document.createDocumentFragment()
        ,oGrow = {
          '-webkit-box-flex': 1
          ,'-moz-box-flex': 1
          ,'-webkit-flex-grow': 1
          ,'-moz-flex-grow': 1
          ,'-ms-flex-grow': 1
          ,'flex-grow': 1
        }

      // Initialise event listeners (and signals).
      model.entryShown.add(handleEntryShown)
      mContent.addEventListener('scroll',handleContentScroll)
      resize.add(handleContentScroll)

      // Initialise view
      mContent.appendChild(mContentWrapper)

      // todo:document
      function handleEntryShown(entry) {
        // console.log('handleEntryShown',Date.now(),entry&&entry.info.name,entry); // log
        //totaltimeline.view.log('handleEntryShown',entry.info.name)
        that.currentEntry = entry
        clearChildren(mContentWrapper)
        clearChildren(mFragment)
        setContentGrow(1)
        mContent.scrollTop = 0
        if (entry) {
          let sTime = ''
          // console.log('entry.factory===event',entry.factory===event); // todo: remove log
          if (entry.factory===event) {
            sTime = entry.moment.toString()
            // scroll if entry is not within view
            if (!oRange.coincides(entry.moment)) {
              const iAgo = entry.moment.ago
                ,iDuration = oRange.duration
                ,iNewStart = iAgo + iDuration/2
                ,iNewEnd = iAgo - iDuration/2

              // have to add callback because animation immediately cancels content entry
              oRange.animate(iNewStart,iNewEnd,handleEntryShown.bind(null,entry))
            }
          } else if (entry.factory===period) {
            sTime = entry.range.start.toString()+' - '+entry.range.end.toString()
          }
          mContentWrapper.innerHTML = tmpl('content_tmpl',Object.assign(entry,{
            time: sTime
          }))
        }
      }

      // todo:document
      function handleContentScroll(){
        var iScrollTop = mContent.scrollTop
          ,iScrollHeight = mContent.scrollHeight
          ,iHeight = mContent.offsetHeight
          ,bSameHeight = iHeight===iScrollHeight
          ,fPart

        if (bSameHeight&&oGrow['flex-grow']!==1) {
          fPart = 1
        } else if (bSameHeight) {
          fPart = 0
        } else {
          fPart = iScrollTop/(iScrollHeight-iHeight)
        }
        //console.log('\tiScrollTop',iScrollTop); // log
        //console.log('\tiScrollHeight',iScrollHeight); // log
        //console.log('\tiHeight',iHeight); // log
        //console.log('\t\tfPart',fPart); // log
        setContentGrow(1+fPart*2); // todo: get that 1 from less
      }

      // todo:document
      function setContentGrow(value){
        for (var s in oGrow) {
          oGrow[s] = value
        }
        oContentStyle.set(oGrow)
      }
      ////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////
    }
  }
  ,{
    currentEntry: {writable}
    // ,_result: {writable}
  }
)
