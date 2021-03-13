import {create} from './component'
import time from '../time'
import view from './'
import {getPercentage,stringToElement,clearChildren} from '../util'
import model from '../model'
import touch from '../touch'
import key from '../signal/key'
import resize from '../signal/resize'
import mouseWheel from '../signal/mouseWheel'

export default create(
  'data-overview'
  ,{
    init(element){

      const span = model.span
      const range = model.range
      const body = document.body
      const elmSpan = stringToElement(`<div class="span">
	<time>${span.start.toString()}</time>
	<time>${span.end.toString()}</time>
	<input type="radio" name="lock" class="visuallyhidden" id="lockStart" /><label class="icn-unlocked" for="lockStart"></label>
	<input type="radio" name="lock" class="visuallyhidden" id="lockEnd" /><label class="icn-unlocked" for="lockEnd"></label>
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
      range.change.add(onRangeChange)
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
        const iOffsetX = e.clientX
        mouseXOffsetDelta = iOffsetX-mouseXOffsetLast
        mouseXOffsetLast = iOffsetX
        range.moveStart(range.start.ago - Math.round(mouseXOffsetDelta/spanWidth*span.duration))
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
          width: getPercentage(range.duration/span.duration)
          ,left: getPercentage(1-range.start.ago/span.duration)
          ,backgroundImage: view.rangeGradient
        })
        //
        elmBefore.style.backgroundColor = view.colorFirst
        elmAfter.style.backgroundColor = view.colorLast
        //
        elmTime.textContent = time.duration(range.duration,2)
        elmTimeFrom.textContent = range.start.toString()
        elmTimeTo.textContent = range.end.toString()
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
          range.set(relativeOffset(touches[0]),relativeOffset(touches[1]))
          e.preventDefault()
        }
      }

      /**
       * CLicking the labels lock the range
       * @param {MouseEvent} e
       */
      function onElementClick(e){
        const {target} = e
        if (target.nodeName==='LABEL') {
          const input = document.getElementById(target.getAttribute('for'))
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
        range.lock = ['lockNone','lockStart','lockEnd'].indexOf(id)
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
        let fRangeGrowRate = 0.01111*span.duration<<0
        let iStart = range.start.ago
        let iEnd = range.end.ago
        // offset calculations
        let iRangeL = elmRange.offsetLeft
        let iRangeR = iRangeL+elmRange.offsetWidth
        let iDeltaL = iRangeL-mouseX
        let iDeltaR = mouseX-iRangeR
        let iDeltaTotal = Math.abs(iDeltaL) + Math.abs(iDeltaR)
        let fDeltaL = iDeltaL/iDeltaTotal
        let fDeltaR = iDeltaR/iDeltaTotal
        // new positions
        let iNewStart
        let iNewEnd
        //
        if (!zoomin) {
          if (iStart===time.UNIVERSE) {
            fDeltaL = 0
            fDeltaR = -1
          }
          if (iEnd===0) {
            fDeltaL = -1
            fDeltaR = 0
          }
        }
        iNewStart = iStart + fDeltaL*(zoomin?fRangeGrowRate:-fRangeGrowRate)
        iNewEnd = iEnd + fDeltaR*(zoomin?-fRangeGrowRate:fRangeGrowRate)
        //
        if (iNewEnd>iNewStart) {
          const iHalf = iNewStart + Math.ceil((iNewEnd-iNewStart)/2)
          iNewStart = iHalf-1
          iNewEnd = iHalf
        }
        range.set(iNewStart,iNewEnd)
      }

      /**
       * Moves the 'range' object.
       * @param {number} x The amount of pixels to move.
       */
      function rangeMove(x){
        range.moveStart(relativeOffset(x-mouseXOffset))
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
