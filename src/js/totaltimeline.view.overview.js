/**
 * @namespace totaltimeline.view.overview
 */
iddqd.ns('totaltimeline.view.overview',(function(iddqd){
	'use strict';

	var string = totaltimeline.string
		,time = totaltimeline.time
		,view = totaltimeline.view
		,getPercentage = totaltimeline.util.getPercentage
		//,log = totaltimeline.view.log
		,model
		,signals = iddqd.signals
		,keys
		,oSpan
		,oRange
		,mBody
		,mOverView
		,mSpan
		,mRange
		,mTime,mTimeFrom,mTimeTo
		,iSpanW = 800
		,fRangeWidth
		,fRangeStart
		,bOver = false
		,iMouseXOffset = 0
		,bRangeMouseDown = false
	;

	function init(model){
		initVariables(model);
		if (mOverView) {
			initEvents();
			initView();
		}
	}

	/**
	 * Initialise Variables
	 * @param {model} _model
	 */
	function initVariables(_model){
		// span and range
		model = _model;
		oSpan = model.span;
		oRange = model.range;
		// view elements
		mBody = document.body;
		mOverView = document.getElementById('overview');
		//
		mSpan = zen('div.span>(time+time+div.range>time*3)').pop();
		var amSpanTime = mSpan.getElementsByTagName('time');
		amSpanTime[0].innerText = oSpan.start.toString();
		amSpanTime[1].innerText = oSpan.end.toString();
		//
		mRange = mSpan.querySelector('.range');
		var amRangeTime = mRange.querySelectorAll('time');
		mTimeFrom = amRangeTime[0];
		mTime = amRangeTime[1];
		mTimeTo = amRangeTime[2];
		//
		//
		// init and detach keypress so keys exist
		signals.keypress.add(iddqd.fn).detach();
		keys = signals.keypress.keys;
	}

	/**
	 * Initialise event listeners (and signals).
	 */
	function initEvents(){
		// resize
		signals.resize.add(handleResize);
		// is over
		[string.mouseover,string.mouseout,string.mousemove].forEach(function(event){
			mOverView.addEventListener(event,handleOverViewMouse,false);
		});
		// drag
		mRange.addEventListener(string.mousedown,handleRangeMouseClick,false);
		mBody.addEventListener(string.mousemove,handleBodyMouseMove,false);
		mBody.addEventListener(string.mouseup,handleRangeMouseClick,false);
		// wheel
		signals.mousewheel.add(handleWheel);
		oRange.change.add(handleRangeChange);
		// touch
		mRange.addEventListener(string.touchstart,handleTouchStart,false);
		totaltimeline.touch(mSpan,handleTouchMove);
		//mSpan.addEventListener(s.touchmove,handleTouchMove,false);
	}

	/**
	 * Initialise view
	 */
	function initView(){
		while (mOverView.childNodes.length) { // todo: move to utils (also in collection)
			mOverView.removeChild(mOverView.firstChild);
		}
		mOverView.appendChild(mSpan);
		handleResize();
		handleRangeChange();
	}

	/**
	 * Handle resize Signal
	 * Cache view element size on resize
	 */
	function handleResize(){//ow,oh,w,h
		iSpanW = mSpan.offsetWidth;
	}

	/**
	 * Handles mouse events on mSpan to see when the mouse is inside mSpan.
	 * @param e
	 */
	function handleOverViewMouse(e){
		bOver = e.type!==string.mouseout;
	}

	/**
	 * Handles click event. Determines when the mouse is down and stores the offset with mSpan.
	 * @param e
	 */
	function handleRangeMouseClick(e){
		bRangeMouseDown = e.type===string.mousedown;
		if (bRangeMouseDown) iMouseXOffset = e.offsetX;
		if (bRangeMouseDown) {
			iMouseXOffsetDelta = 0;
			iMouseXOffsetLast = e.clientX;
		}
	}
	var iMouseXOffsetDelta = 0;
	var iMouseXOffsetLast = 0;

	/**
	 * Handles move event and moves mRange if the mouse is down.
	 * @param e
	 */
	function handleBodyMouseMove(e){
		if (bRangeMouseDown) {
			// todo: rangeMove? ... This is relative... rangeMove is ~absolute
			var iOffsetX = e.clientX;//offsetX;
			iMouseXOffsetDelta = iOffsetX-iMouseXOffsetLast;
			iMouseXOffsetLast = iOffsetX;
			oRange.moveStart(oRange.start.ago - Math.round(iMouseXOffsetDelta/iSpanW*oSpan.duration));
		}
	}

	/**
	 * Handles the wheel event to zoom or move mRange.
	 * @param {number} direction Corresponds to wheelDelta
	 * @param {Event} e The WheelEvent
	 */
	function handleWheel(direction,e){
		if (bOver) {
			if (keys[16]) rangeMove(mRange.offsetLeft+(direction>0?2:-2)+iMouseXOffset);
			else rangeZoom(direction>0,e.clientX);
		}
	}

	/**
	 * Changes view to reflect changes in the 'range' object.
	 */
	function handleRangeChange(){
		fRangeWidth = oRange.duration/oSpan.duration;//Math.min(1,oRange.duration/oSpan.duration);
		fRangeStart = 1-oRange.start.ago/oSpan.duration;
		mRange.style.width = getPercentage(fRangeWidth);
		mRange.style.left = getPercentage(fRangeStart);

		mRange.style.backgroundImage = view.rangeGradient;

		mTime.innerText = time.duration(oRange.duration,2);
		mTimeFrom.innerText = oRange.start.toString();
		mTimeTo.innerText = oRange.end.toString();
	}


	/**
	 * Handles touchstart event to scroll or zoom the timeline.
	 * @param {Event} e
	 */
	function handleTouchStart(e) {
		iMouseXOffset = (e.offsetX||e.touches[0].pageX)-mRange.offsetLeft;
	}

	/**
	 * Handles touchmove event to scroll or zoom the timeline.
	 * @param {Event} e
	 * @param {Number} numTouches
	 * @param {Array} touches
	 * @param {Number} numLastTouches
	 * @param {Array} lastTouches
	 */
	function handleTouchMove(e,numTouches,touches){//},numLastTouches,lastTouches) {
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
		var fRangeGrowRate = 0.01111*oSpan.duration<<0
			,iStart = oRange.start.ago
			,iEnd = oRange.end.ago
			// offset calculations
			,iRangeL = mRange.offsetLeft
			,iRangeR = iRangeL+mRange.offsetWidth
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
		var fPartLeft = x/iSpanW;
		return oSpan.duration - Math.floor(fPartLeft*oSpan.duration);
	}

	return init;
})(iddqd));