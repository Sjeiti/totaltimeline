import {create} from './component'
import {duration, UNIVERSE} from '../time'
import {view} from './'
import {getPercentage,stringToElement,clearChildren} from '../util'
import {span, currentRange} from '../model'
import {touch} from '../touch'
import {key} from '../signal/key'
import {resize} from '../signal/resize'
import {mouseWheel} from '../signal/mouseWheel'
import {parentQuerySelector} from '../utils/html'

create(
  'data-overview'
  ,{
    init(element){

      const body = document.body
      const elmSpan = stringToElement(`<div class="span">
	<time>${span.start.toString()}</time>
	<time>${span.end.toString()}</time>
	<input type="radio" name="lock" class="visuallyhidden" id="lockStart" /><label for="lockStart">
    <svg data-icon="lock"><title>locked</title></svg>
    <svg data-icon="unlocked"><title>unlocked</title></svg>
  </label>
	<input type="radio" name="lock" class="visuallyhidden" id="lockEnd" /><label for="lockEnd">
    <svg data-icon="lock"><title>locked</title></svg>
    <svg data-icon="unlocked"><title>unlocked</title></svg>
  </label>
	<input type="radio" name="lock" class="visuallyhidden" id="lockNone" />
	<div class="range">
    <div class="before"></div>
		<time></time>
		<time></time>
		<time></time>
    <div class="after"></div>
	</div>
</div>`)
      const elmRange = elmSpan.querySelector('.range')
      const elmBefore = elmRange.querySelector('.before')
      const elmAfter = elmRange.querySelector('.after')
      const rangeStyle = elmRange.style
      const [elmTimeFrom,elmTime,elmTimeTo] = elmRange.querySelectorAll('time')

      let spanWidth = 800
      let isOver = false
      let mouseXOffset = 0
      let mouseXOffsetDelta = 0
      let mouseXOffsetLast = 0
      let lastUp = 0
      let isTouchZoom = false

      // Initialise event listeners (and signals).
      // init and detach keypress so keys exist
      key.press.add(()=>{}).detach()
      // resize
      resize.add(onResize)
      // is over
      ;['mouseover','mouseout','mousemove'].forEach(e=>element.addEventListener(e,onOverViewMouse,false))
      // drag
      elmRange.addEventListener('mousedown',onRangeMouseDownUp,false)
      // wheel
      mouseWheel.add(onWheel)
      currentRange.change.add(onRangeChange)
      // touch
      elmRange.addEventListener('touchstart',onTouchStart,false)
      elmRange.addEventListener('touchend',onTouchEnd,false)
      touch(elmSpan,onTouchMove)
      //mSpan.addEventListener(s.touchmove,onTouchMove,false)
      //
      const lockNone = elmSpan.querySelector('#lockNone')
      element.addEventListener('click',onElementClick)
      element.addEventListener('change',onElementChange)

      // Initialise view
      clearChildren(element).appendChild(elmSpan)
      onResize()
      onRangeChange()

      /**
       * Handle resize Signal
       * Cache view element size on resize
       */
      function onResize(){//ow,oh,w,h
        spanWidth = elmSpan.offsetWidth
      }

      /**
       * Handles mouse events on mSpan to see when the mouse is inside mSpan.
       * @param {Event} e
       */
      function onOverViewMouse(e){
        isOver = e.type!=='mouseout'
      }

      /**
       * Handles click event. Determines when the mouse is down and stores the offset with mSpan.
       * @param {Event} e
       */
      function onRangeMouseDownUp(e){
        if (e.type==='mousedown') {
          mouseXOffset = e.offsetX
          mouseXOffsetDelta = 0
          mouseXOffsetLast = e.clientX
          document.addEventListener('mousemove',onDocumentMouseMove,false)
          body.addEventListener('mouseup',onRangeMouseDownUp,false)
        } else {
          document.removeEventListener('mousemove',onDocumentMouseMove,false)
          body.removeEventListener('mouseup',onRangeMouseDownUp,false)
        }
      }

      /**
       * Handles move event and moves mRange if the mouse is down.
       * @param {Event} e
       */
      function onDocumentMouseMove(e){
        const offsetX = e.clientX
        mouseXOffsetDelta = offsetX-mouseXOffsetLast
        mouseXOffsetLast = offsetX
        currentRange.moveStart(currentRange.start.ago - Math.round(mouseXOffsetDelta/spanWidth*span.duration))
      }

      /**
       * Handles the wheel event to zoom or move mRange.
       * @param {number} direction Corresponds to wheelDelta
       * @param {Event} e The WheelEvent
       */
      function onWheel(direction,e){
        if (isOver) {
          if (key[16]) rangeMove(elmRange.offsetLeft+(direction>0?2:-2)+mouseXOffset)
          else rangeZoom(direction>0,e.clientX)
        }
      }

      /**
       * Changes view to reflect changes in the 'range' object.
       */
      function onRangeChange(){
        Object.assign(rangeStyle,{
          width: getPercentage(currentRange.duration/span.duration)
          ,left: getPercentage(1-currentRange.start.ago/span.duration)
          ,backgroundImage: view.rangeGradient
        })
        //
        elmBefore.style.backgroundColor = view.colorFirst
        elmAfter.style.backgroundColor = view.colorLast
        //
        elmTime.textContent = duration(currentRange.duration,2)
        elmTimeFrom.textContent = currentRange.start.toString()
        elmTimeTo.textContent = currentRange.end.toString()
      }

      /**
       * Handles touchstart event to scroll or zoom the timeline.
       * @param {Event} e
       */
      function onTouchStart(e) {
        const t = Date.now()
        if (e.touches.length===1&&(t-lastUp)<300) {
          isTouchZoom = true
        }
        mouseXOffset = (e.offsetX||e.touches[0].pageX)-elmRange.offsetLeft
      }

      /**
       * Handles touchend event to scroll or zoom the timeline.
       * @param {Event} e
       */
      function onTouchEnd(e) {
        if (e.touches.length){
          lastUp = Date.now()
        } else {
          isTouchZoom = false
        }
      }

      /**
       * Handles touchmove event to scroll or zoom the timeline.
       * @param {Event} e
       * @param {Number} numTouches
       * @param {Array} touches
       * @_param {Number} numLastTouches
       * @_param {Array} lastTouches
       */
      function onTouchMove(e,numTouches,touches){//},numLastTouches,lastTouches) {
        if (numTouches===1){
          if (isTouchZoom) {
            rangeZoomTouch(touches[0])
          } else {
            rangeMove(touches[0])
          }
          e.preventDefault()
        } else if (numTouches===2){
          currentRange.set(relativeOffset(touches[0]),relativeOffset(touches[1]))
          e.preventDefault()
        }
      }

      /**
       * CLicking the labels lock the range
       * @param {MouseEvent} e
       */
      function onElementClick(e){
        const {target} = e
        const parentLock = parentQuerySelector(target, '[for^=lock]')
        if (parentLock) {
          const input = document.getElementById(parentLock.getAttribute('for'))
          if (input.checked) {
            e.preventDefault()
            lockNone.checked = true
            lockNone.dispatchEvent(new Event('change', {
              'bubbles': true,
              'cancelable': true
            }))
          }
        }
      }

      /**
       * CLicking the labels lock the range
       * @param {Event} e
       */
      function onElementChange(e){
        const {target} = e
        const {id} = target
        currentRange.lock = ['lockNone','lockStart','lockEnd'].indexOf(id)
      }

      function rangeZoomTouch(touch){
        console.log('touch',touch)
      }

      /**
       * Zooms the 'range' object relative to the duration of the 'span' object and accounting for the mouse position relative to the mSpan element.
       * @param {boolean} zoomin Zoom in or out.
       * @param {number} mouseX Mouse offset
       */
      function rangeZoom(zoomin,mouseX){
        const rangeGrowRate = 0.01111*span.duration<<0
        const start = currentRange.start.ago
        const end = currentRange.end.ago
        // offset calculations
        const rangeL = elmRange.offsetLeft
        const rangeR = rangeL+elmRange.offsetWidth
        const deltaL = rangeL-mouseX
        const deltaR = mouseX-rangeR
        const deltaTotal = Math.abs(deltaL) + Math.abs(deltaR)
        let deltaLPart = deltaL/deltaTotal
        let deltaRPart = deltaR/deltaTotal
        // new positions
        let newStart
        let newEnd
        //
        if (!zoomin) {
          if (start===UNIVERSE) {
            deltaLPart = 0
            deltaRPart = -1
          }
          if (end===0) {
            deltaLPart = -1
            deltaRPart = 0
          }
        }
        newStart = start + deltaLPart*(zoomin?rangeGrowRate:-rangeGrowRate)
        newEnd = end + deltaRPart*(zoomin?-rangeGrowRate:rangeGrowRate)
        //
        if (newEnd>newStart) {
          const iHalf = newStart + Math.ceil((newEnd-newStart)/2)
          newStart = iHalf-1
          newEnd = iHalf
        }
        currentRange.set(newStart,newEnd)
      }

      /**
       * Moves the 'range' object.
       * @param {number} x The amount of pixels to move.
       */
      function rangeMove(x){
        currentRange.moveStart(relativeOffset(x-mouseXOffset))
      }

      /**
       * Calculates an x position relative to mSpan and its associated 'range' object.
       * @param {number} x Position in pixels
       * @returns {number} Years ago
       */
      function relativeOffset(x) {
        return span.duration - Math.floor((x/spanWidth)*span.duration)
      }
    }
  }
)
