import {create} from './component'
import time from '../time'
import view from './'
import {getFragment} from '../util'
import collections from '../collections'
import model from '../model'
import touch from '../touch'
import key from '../signal/key'
import resize from '../signal/resize'
import mouseWheel from '../signal/mouseWheel'

export default create(
  'data-timeline'
  ,{
    init(element){
      /////////////////////////////////////////////////////
      /////////////////////////////////////////////////////

      const range = model.range
      const body = document.body
      const elements = getFragment(`<time></time><time></time>
<div class="before"></div><div class="after"></div>
<div class="overlay"></div>`)
      const elmOverlay = elements.querySelector('.overlay')
      const elmTimeFrom = elements.querySelector('time')//document.createElement('time')
      const elmTimeTo = elements.querySelector('time:nth-child(2)')//document.createElement('time')
      const elmBefore = elements.querySelector('.before')//.createElement('div')
      const elmAfter = elements.querySelector('.after')//document.createElement('div')

      let backgroundPos = 0
      let viewW
      let viewH
      let viewL
      let isOver = false
      //
      let mouseXOffsetDelta = 0
      let mouseXOffsetLast = 0
      let resizeTimeout

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
      // collections
      collections.forEach(col=>{
        element.appendChild(col.wrapper)
        col.dataLoaded.add(onRangeChange)
      })
      // touch
      touch(element,onTouchMove)
      // range
      range.change.add(onRangeChange)
      range.change.add(moveBackgroundOverlay)

      // Initialise view
      element.appendChild(elements)
      onResize()
      onRangeChange()

      /**
       * Handle resize Signal
       * Cache view element size on resize
       */
      function onResize(){
        viewW = element.offsetWidth
        viewH = element.offsetHeight
        viewL = element.offsetLeft
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(collections.resize.bind(collections,viewW,viewH,range),200)
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
          mouseXOffsetLast = e.clientX//.offsetX
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
        const offsetX = e.clientX
        mouseXOffsetDelta = offsetX-mouseXOffsetLast
        mouseXOffsetLast = offsetX
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
          const scaleMove = 0.02
          const scaleZoom = 0.1
          const isZoomin = direction>0
          const zoomin = isZoomin?1:-1
          const start = range.start.ago
          let newStart
          let newEnd

          if (key[16]) {
            newStart = start + zoomin*Math.round(scaleMove*range.duration)
            range.moveStart(newStart)
          } else {
            const add = zoomin*Math.round(scaleZoom*range.duration)
            // offset calculations
            const mouseX = e.clientX
            const left = (mouseX-viewL)/viewW
            const right = 1-left
            // new position
            newStart = Math.round(range.start.ago - 0.5*left*add)
            newEnd = Math.round(range.end.ago + 0.5*right*add)
            range.set(newStart,newEnd)
          }
        }
      }

      /**
       * When the range changes all view element are recalculated
       */
      function onRangeChange(){ // todo: possibly refactor since also called by collections -> col.dataLoaded
        elmTimeFrom.innerText = range.start.toString()
        elmTimeTo.innerText = range.end.toString()
        element.style.backgroundImage = view.rangeGradient
        //
        elmBefore.style.backgroundColor = view.colorFirst
        elmAfter.style.backgroundColor = view.colorLast
        //
        collections.render(range)
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
            var touch1Last = lastTouches[0]
            var touch2Last = lastTouches[1]
            var touch1LastTime = range.start.ago - (touch1Last/viewW)*iRangeDuration
            var touch2LastTime = range.end.ago + (1-touch2Last/viewW)*iRangeDuration
            var touchWLast = touch2Last-touch1Last
            var touchLastDuration = (touchWLast/viewW)*iRangeDuration
            //
            var touch1 = touches[0]
            var touch2 = touches[1]
            var touchW = touch2-touch1
            //
            var part1 = touch1/viewW
            var part2 = 1-touch2/viewW
            var partW = touchW/viewW
            //
            var part1W = part1/partW
            var part2W = part2/partW
            var part1WDuration = part1W*touchLastDuration
            var part2WDuration = part2W*touchLastDuration
            //
            var newStart =	Math.floor(touch1LastTime + part1WDuration)
            var newEnd =		Math.floor(touch2LastTime - part2WDuration)

            range.set(
              newStart
              ,newEnd
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
        var currentDuration = range.duration
        var rangeCenter = range.end.ago + currentDuration/2
        var oldRangeCenter = oldrange.end.ago + oldrange.duration/2
        var deltaCenter = rangeCenter - oldRangeCenter
        var offset = deltaCenter/currentDuration*viewW

        // background-size is contain so mod by viewH to prevent errors
        backgroundPos = (backgroundPos + Math.round(offset))%viewH
        elmOverlay.style.backgroundPosition = backgroundPos+'px 0'
      }
      /////////////////////////////////////////////////////
      /////////////////////////////////////////////////////
    }
  }
)
