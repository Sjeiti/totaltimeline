/**
 * @name overview
 * @namespace totaltimeline.view
 */
iddqd.ns('totaltimeline.view.overview',(function(iddqd){
	'use strict';

	var s = totaltimeline.string
		,time = totaltimeline.time
		,model
		,signals = iddqd.signals
		,keys
		,oSpan
		,oRange
		,mBody
		,mSpan
		,mRange
		,fRangeWidth
		,fRangeStart
		,bOver = false
		,iMouseXOffset = 0
		,bRangeMouseDown = false
	;

	function init(model){
		initVariables(model);
		initEvents();
		initView();
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
		mSpan = document.getElementById('overview');
		mRange = zen('div.range.show-range').pop();
		// init and detach keypress so keys exist
		signals.keypress.add(iddqd.fn).detach();
		keys = signals.keypress.keys;
	}

	/**
	 * Initialise event listeners (and signals).
	 */
	function initEvents(){
		[s.mouseover,s.mouseout,s.mousemove].forEach(function(event){
			mSpan.addEventListener(event,handleSpanMouse,false);
		});
		mRange.addEventListener(s.mousedown,handleRangeMouseClick,false);
		mBody.addEventListener(s.mousemove,handleBodyMouseMove,false);
		mBody.addEventListener(s.mouseup,handleRangeMouseClick,false);
		signals.mousewheel.add(handleWheel);
		oRange.change.add(handleRangeChange);
	}

	/**
	 * Initialise view
	 */
	function initView(){
		mSpan.appendChild(mRange);
		mSpan.setAttribute(s.dataBefore,oSpan.start.toString());
		mSpan.setAttribute(s.dataAfter,oSpan.end.toString());
		handleRangeChange();
	}

	/**
	 * Handles mouse events on mSpan to see when the mouse is inside mSpan.
	 * @param e
	 */
	function handleSpanMouse(e){
		bOver = e.type!==s.mouseout;
	}

	/**
	 * Handles click event. Determines when the mouse is down and stores the offset with mSpan.
	 * @param e
	 */
	function handleRangeMouseClick(e){
		bRangeMouseDown = e.type===s.mousedown;
		if (bRangeMouseDown) iMouseXOffset = e.offsetX;
	}

	/**
	 * Handles move event and moves mRange if the mouse is down.
	 * @param e
	 */
	function handleBodyMouseMove(e){
		bRangeMouseDown&&rangeMove(e.clientX);
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
		fRangeWidth = oRange.duration/oSpan.duration;
		fRangeStart = 1-oRange.start.ago/oSpan.duration;
		mRange.style.width = s.getPercentage(fRangeWidth);
		mRange.style.left = s.getPercentage(fRangeStart);
		mRange.setAttribute(s.dataBefore,oRange.start.toString());
		mRange.setAttribute(s.dataAfter,oRange.end.toString());
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
		if (iNewEnd<0) iNewEnd = 0;
		if (iNewStart>time.UNIVERSE) iNewStart = time.UNIVERSE;
		if (iNewEnd>iNewStart) {
			iNewStart = iStart;
			iNewEnd = iEnd;
		}
		oRange.start.set(iNewStart,false);
		oRange.end.set(iNewEnd);
	}

	/**
	 * Moves the 'range' object.
	 * @param {number} x The amount of pixels to move.
	 */
	function rangeMove(x){
		// todo: check max and min
		var iSpanWidth = mSpan.offsetWidth
			,iRangeWidth = mRange.offsetWidth
			,iNewLeft = Math.min(Math.max(x-iMouseXOffset,0),iSpanWidth-iRangeWidth)
			,fPartLeft = iNewLeft/iSpanWidth
			,iNewStart = oSpan.duration - Math.floor(fPartLeft*oSpan.duration);
		oRange.moveStart(iNewStart);
	}

	return init;
})(iddqd));