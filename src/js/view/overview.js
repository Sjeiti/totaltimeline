
import {create} from './component'
import time from '../time'
import view from '../'
import {getPercentage,getFragment} from '../util'
import model from '../model'
import touch from '../touch'
import key from '../signal/key'
import resize from '../signal/resize'
import mouseWheel from '../signal/mouseWheel'

// const writable = true
create(
  'data-overview'
  ,{
    init(){
      //////////////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////////////////////

      const oSpan = model.span
        ,oRange = model.range
        ,body = document.body
        ,elmSpan = getFragment(`<div class="span">
	<time>${oSpan.start.toString()}</time>
	<time>${oSpan.end.toString()}</time>
	<div class="range">
		<time></time>
		<time></time>
		<time></time>
	</div>
</div>`).firstElementChild
        ,elmRange = elmSpan.querySelector('.range')
        ,rangeStyle = elmRange.style
        ,[elmTimeFrom,elmTime,elmTimeTo] = elmRange.querySelectorAll('time')

      let iSpanW = 800
        ,bOver = false
        ,iMouseXOffset = 0
        ,iMouseXOffsetDelta = 0
        ,iMouseXOffsetLast = 0

      // Initialise event listeners (and signals).
      // init and detach keypress so keys exist
      key.press.add(()=>{}).detach()
      // resize
      resize.add(onResize);
      // is over
      ['mouseover','mouseout','mousemove'].forEach(e=>this.element.addEventListener(e,onOverViewMouse,false))
      // drag
      elmRange.addEventListener('mousedown',onRangeMouseDownUp,false);
      // wheel
      mouseWheel.add(onWheel);
      oRange.change.add(onRangeChange);
      // touch
      elmRange.addEventListener('touchstart',onTouchStart,false);
      touch(elmSpan,onTouchMove);
      //mSpan.addEventListener(s.touchmove,onTouchMove,false);

      // Initialise view
      while (this.element.childNodes.length) { // todo: move to utils (also in collection)
        this.element.removeChild(this.element.firstChild);
      }
      this.element.appendChild(elmSpan);
      onResize();
      onRangeChange();

      /**
       * Handle resize Signal
       * Cache view element size on resize
       */
      function onResize(){//ow,oh,w,h
        iSpanW = elmSpan.offsetWidth;
      }

      /**
       * Handles mouse events on mSpan to see when the mouse is inside mSpan.
       * @param e
       */
      function onOverViewMouse(e){
        bOver = e.type!=='mouseout';
      }

      /**
       * Handles click event. Determines when the mouse is down and stores the offset with mSpan.
       * @param e
       */
      function onRangeMouseDownUp(e){
        if (e.type==='mousedown') {
          iMouseXOffset = e.offsetX;
          iMouseXOffsetDelta = 0;
          iMouseXOffsetLast = e.clientX;
          document.addEventListener('mousemove',onDocumentMouseMove,false);
          body.addEventListener('mouseup',onRangeMouseDownUp,false);
        } else {
          document.removeEventListener('mousemove',onDocumentMouseMove,false);
          body.removeEventListener('mouseup',onRangeMouseDownUp,false);
        }
      }

      /**
       * Handles move event and moves mRange if the mouse is down.
       * @param e
       */
      function onDocumentMouseMove(e){
        // todo: rangeMove? ... This is relative... rangeMove is ~absolute
        var iOffsetX = e.clientX;//offsetX;
        iMouseXOffsetDelta = iOffsetX-iMouseXOffsetLast;
        iMouseXOffsetLast = iOffsetX;
        oRange.moveStart(oRange.start.ago - Math.round(iMouseXOffsetDelta/iSpanW*oSpan.duration));
      }

      /**
       * Handles the wheel event to zoom or move mRange.
       * @param {number} direction Corresponds to wheelDelta
       * @param {Event} e The WheelEvent
       */
      function onWheel(direction,e){
        console.log('wheel',direction,e); // todo: remove log
        if (bOver) {
          if (key[16]) rangeMove(elmRange.offsetLeft+(direction>0?2:-2)+iMouseXOffset);
          else rangeZoom(direction>0,e.clientX);
        }
      }

      /**
       * Changes view to reflect changes in the 'range' object.
       */
      function onRangeChange(){
        Object.assign(rangeStyle,{
          width: getPercentage(oRange.duration/oSpan.duration)
          ,left: getPercentage(1-oRange.start.ago/oSpan.duration)
          ,backgroundImage: view.rangeGradient
        })
        elmTime.textContent = time.duration(oRange.duration,2)
        elmTimeFrom.textContent = oRange.start.toString()
        elmTimeTo.textContent = oRange.end.toString()
      }


      /**
       * Handles touchstart event to scroll or zoom the timeline.
       * @param {Event} e
       */
      function onTouchStart(e) {
        iMouseXOffset = (e.offsetX||e.touches[0].pageX)-elmRange.offsetLeft;
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
          rangeMove(touches[0]);
          e.preventDefault();
        } else if (numTouches===2){
          oRange.set(relativeOffset(touches[0]),relativeOffset(touches[1]));
          e.preventDefault();
        }
      }

      /**
       * Zooms the 'range' object relative to the duration of the 'span' object and accounting for the mouse position relative to the mSpan element.
       * @param {boolean} zoomin Zoom in or out.
       * @param {number} mouseX Mouse offset
       */
      function rangeZoom(zoomin,mouseX){
        console.log('rangeZoom',zoomin,mouseX); // todo: remove log
        var fRangeGrowRate = 0.01111*oSpan.duration<<0
          ,iStart = oRange.start.ago
          ,iEnd = oRange.end.ago
          // offset calculations
          ,iRangeL = elmRange.offsetLeft
          ,iRangeR = iRangeL+elmRange.offsetWidth
          ,iDeltaL = iRangeL-mouseX
          ,iDeltaR = mouseX-iRangeR
          ,iDeltaTotal = Math.abs(iDeltaL) + Math.abs(iDeltaR)
          ,fDeltaL = iDeltaL/iDeltaTotal
          ,fDeltaR = iDeltaR/iDeltaTotal
          // new positions
          ,iNewStart
          ,iNewEnd
        ;
        if (!zoomin) {
          if (iStart===time.UNIVERSE) {
            fDeltaL = 0;
            fDeltaR = -1;
          }
          if (iEnd===0) {
            fDeltaL = -1;
            fDeltaR = 0;
          }
        }
        iNewStart = iStart + fDeltaL*(zoomin?fRangeGrowRate:-fRangeGrowRate);
        iNewEnd = iEnd + fDeltaR*(zoomin?-fRangeGrowRate:fRangeGrowRate);
        //
    //		if (iNewEnd<0) iNewEnd = 0;
    //		if (iNewStart>time.UNIVERSE) iNewStart = time.UNIVERSE;
        if (iNewEnd>iNewStart) {
          var iHalf = iNewStart + Math.ceil((iNewEnd-iNewStart)/2);
          iNewStart = iHalf-1;
          iNewEnd = iHalf;
        }
        oRange.set(iNewStart,iNewEnd);
        //oRange.start.set(iNewStart,false);
        //oRange.end.set(iNewEnd);
      }

      /**
       * Moves the 'range' object.
       * @param {number} x The amount of pixels to move.
       */
      function rangeMove(x){
        oRange.moveStart(relativeOffset(x-iMouseXOffset));
      }

      /**
       * Calculates an x position relative to mSpan and its associated 'range' object.
       * @param {number} x Position in pixels
       * @returns {number} Years ago
       */
      function relativeOffset(x) {
        return oSpan.duration - Math.floor((x/iSpanW)*oSpan.duration);
      }
      //////////////////////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////////////////////
    //   const parent = this.element.parentNode
    //     ,html = getFragment(`<input type="text" id="search" placeholder="Search" autocomplete="off" />
    // <ul id="searchResult"></ul>`)
    //   this._input = html.querySelector('input')
    //   this._result = html.querySelector('ul')
    }
  }
  ,{
    // _input: {writable}
    // ,_result: {writable}
  }
)
