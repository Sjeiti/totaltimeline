
import {create} from './component'
import time from '../time'
import view from '../'
import {getFragment,clearChildren} from '../util'
import collection from '../collection'
import model from '../model'
import touch from '../touch'
import key from '../signal/key'
import resize from '../signal/resize'
import mouseWheel from '../signal/mouseWheel'

create(
  'data-timeline'
  ,{
    init(){
      /////////////////////////////////////////////////////
      /////////////////////////////////////////////////////

      var element = this.element
        ,range = model.range
        //
        ,body = document.body
        ,elmOverlay = getFragment('<div class="overlay"></div>').firstChild
        ,elmTimeFrom = document.createElement('time')
        ,elmTimeTo = document.createElement('time')
        //
        ,backgroundPos = 0
        //
        ,viewW
        ,viewH
        ,viewL
        ,isOver = false
        //
        ,mouseXOffsetDelta = 0
        ,mouseXOffsetLast = 0

      // Initialise event listeners (and signals).
      // init and detach keypress so keys exist
      key.press.add(()=>{}).detach()
      // resize
      resize.add(onResize)
      // is over
      ;['mouseover','mouseout','mousemove'].forEach(e=>element.addEventListener(e,onSpanMouse,false))
      // drag
      element.addEventListener('mousedown',onViewMouseDownUp,false)
      // wheel
      mouseWheel.add(onWheel)
      // collection
      console.log('collection.length',collection.length); // todo: remove log
      collection.forEach(col=>col.dataLoaded.add(onRangeChange))
      // touch
      touch(element,onTouchMove)
      // range
      range.change.add(onRangeChange)
      range.change.add(moveBackgroundOverlay)

      // Initialise view
      clearChildren(element)
      element.appendChild(elmTimeFrom)
      element.appendChild(elmTimeTo)
      element.appendChild(elmOverlay)
      onResize()
      onRangeChange()

      /**
       * Handle resize Signal
       * Cache view element size on resize
       */
      function onResize(){//ow,oh,w,h
        viewW = element.offsetWidth
        viewH = element.offsetHeight
        viewL = element.offsetLeft
      }

      /**
       * Handles mouse events on mSpan to see when the mouse is inside mSpan.
       * @param e
       */
      function onSpanMouse(e){
        isOver = e.type!=='mouseout'
      }

      /**
       * Handles click event. Determines when the mouse is down and stores the offset with the target.
       * @param e
       */
      function onViewMouseDownUp(e){
        if (e.type==='mousedown') {
          mouseXOffsetDelta = 0
          mouseXOffsetLast = e.clientX;//.offsetX
          document.addEventListener('mousemove',handleDocumentMouseMove,false)
          body.addEventListener('mouseup',onViewMouseDownUp,false)
        } else {
          document.removeEventListener('mousemove',handleDocumentMouseMove,false)
          body.removeEventListener('mouseup',onViewMouseDownUp,false)
        }
      }

      /**
       * Handles move event and moves mRange if the mouse is down.
       * @param e
       */
      function handleDocumentMouseMove(e){
        const iOffsetX = e.clientX
        mouseXOffsetDelta = iOffsetX-mouseXOffsetLast
        mouseXOffsetLast = iOffsetX
        if (mouseXOffsetDelta!==0) { // otherwise stuff gets re-added due to inefficient population (causing click events not to fire)
          range.moveStart(range.start.ago + Math.round(mouseXOffsetDelta/element.offsetWidth*range.duration))
        }
      }

      /**
       * Handles the wheel event to zoom or move mRange.
       * @param {number} direction Corresponds to wheelDelta
       * @param {Event} e The WheelEvent
       */
      function onWheel(direction,e){
        if (isOver) {
          var fScaleMove = 0.02
            ,fScaleZoom = 0.1
            ,iNewStart
            ,iNewEnd
            ,bZoomin = direction>0
            ,iZoomin = bZoomin?1:-1
            ,iStart = range.start.ago

          if (key[16]) {
            iNewStart = iStart + iZoomin*(fScaleMove*range.duration<<0)
            range.moveStart(iNewStart)
          } else {
            var fAdd = iZoomin*(fScaleZoom*range.duration<<0)
              // offset calculations
              ,iMouseX = e.clientX
              ,fL = (iMouseX-viewL)/viewW
              ,fR = 1-fL

            /*if (!bZoomin) {
              if (iStart<=time.UNIVERSE) {
                fL = 0
                fR = -1
              }
            }*/
            // new position
            iNewStart = range.start.ago - 0.5*fL*fAdd
            iNewEnd = range.end.ago + 0.5*fR*fAdd
            range.set(iNewStart,iNewEnd)
          }
          // todo: refactor dry
    //			if (key[16]) rangeMove(mRange.offsetLeft+(direction>0?2:-2)+iMouseXOffset)
    //			else rangeZoom(direction>0,e.clientX)
        }
      }

      /**
       * When the range changes all view element are recalculated
       */
      function onRangeChange(){ // todo: possibly refactor since also called by collection -> col.dataLoaded
        console.log('onRangeChange'); // todo: remove log
        elmTimeFrom.innerText = range.start.toString()
        elmTimeTo.innerText = range.end.toString()
        element.style.backgroundImage = view.rangeGradient
        collection.populate(element,range)
      }


      /**
       * Handles touchmove event to scroll or zoom the timeline.
       * @param {Event} e
       * @param {Number} numTouches
       * @param {Array} touches
       * @param {Number} numLastTouches
       * @param {Array} lastTouches
       */
      function onTouchMove(e,numTouches,touches,numLastTouches,lastTouches) {
        if (numTouches===numLastTouches) {
          if (numTouches===1) {
            range.moveStart(range.start.ago+(touches[0]-lastTouches[0])*(range.duration/element.offsetWidth))
            e.preventDefault()
          } else if (numTouches===2) {
            // reverse interpolation to find new start and end points
            var iRangeDuration = range.duration
              //
              ,iTouch1Last = lastTouches[0]
              ,iTouch2Last = lastTouches[1]
              ,fTouch1LastTime = range.start.ago - (iTouch1Last/viewW)*iRangeDuration
              ,fTouch2LastTime = range.end.ago + (1-iTouch2Last/viewW)*iRangeDuration
              ,iTouchWLast = iTouch2Last-iTouch1Last
              ,iTouchLastDuration = (iTouchWLast/viewW)*iRangeDuration
              //
              ,iTouch1 = touches[0]
              ,iTouch2 = touches[1]
              ,iTouchW = iTouch2-iTouch1
              //
              ,fPart1 = iTouch1/viewW
              ,fPart2 = 1-iTouch2/viewW
              ,fPartW = iTouchW/viewW
              //
              ,fPart1W = fPart1/fPartW
              ,fPart2W = fPart2/fPartW
              ,fPart1WDuration = fPart1W*iTouchLastDuration
              ,fPart2WDuration = fPart2W*iTouchLastDuration
              //
              ,iNewStart =	Math.floor(fTouch1LastTime + fPart1WDuration)
              ,iNewEnd =		Math.floor(fTouch2LastTime - fPart2WDuration)

            range.set(
              iNewStart
              ,iNewEnd
            )
            e.preventDefault()
          }
        }
        lastTouches.length = 0
        while (numTouches--) {
          lastTouches[numTouches] = touches[numTouches]
        }
      }

      // todo: document
      function moveBackgroundOverlay(range,oldrange){
        var iCurrentDuration = range.duration
          ,iRangeCenter = range.end.ago + iCurrentDuration/2
          ,iOldRangeCenter = oldrange.end.ago + oldrange.duration/2
          ,iDeltaCenter = iRangeCenter - iOldRangeCenter
          ,iOffset = iDeltaCenter/iCurrentDuration*viewW

        // background-size is contain so mod by viewH to prevent errors
        backgroundPos = (backgroundPos + Math.round(iOffset))%viewH
        elmOverlay.style.backgroundPosition = backgroundPos+'px 0'
      }
      /////////////////////////////////////////////////////
      /////////////////////////////////////////////////////
    }
  }
)