/**
 * @name overview
 * @namespace totaltimeline.view
 */
iddqd.ns('totaltimeline.view.overview',(function(iddqd){
	'use strict';

	var s = totaltimeline.string
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

	function init(span,range){
		oSpan = span;
		oRange = range;
		//
		mBody = document.body;
		mSpan = document.getElementById('overview');
		mRange = zen('div.range.show-range').pop();
		mSpan.appendChild(mRange);
		//
		[s.mouseover,s.mouseout,s.mousemove].forEach(function(event){
			mSpan.addEventListener(event,handleSpanMouse,false);
		});
		mRange.addEventListener(s.mousedown,handleRangeMouseClick,false);
		mBody.addEventListener(s.mousemove,handleBodyMouseMove,false);
		mBody.addEventListener(s.mouseup,handleRangeMouseClick,false);
		signals.mousewheel.add(handleWheel);
		signals.keypress.add(iddqd.fn).detach();
		oRange.change.add(handleRangeChange);
		//
		keys = signals.keypress.keys;
		handleRangeChange();
		//
		mSpan.setAttribute(s.dataBefore,oSpan.start.toString());
		mSpan.setAttribute(s.dataAfter,oSpan.end.toString());
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
	 * @param direction
	 */
	function handleWheel(direction){
		if (bOver) {
			if (keys[16]) rangeMove(mRange.offsetLeft+(direction>0?2:-2)+iMouseXOffset);
			else rangeZoom(direction>0);
		}
	}

	/**
	 * Changes view to reflect changes in the 'range' object.
	 */
	function handleRangeChange(){
		fRangeWidth = oRange.duration/oSpan.duration;
		fRangeStart = 1-oRange.start.ago/oSpan.duration;
		mRange.style.width = getPercentage(fRangeWidth);
		mRange.style.left = getPercentage(fRangeStart);
		mRange.setAttribute(s.dataBefore,oRange.start.toString());
		mRange.setAttribute(s.dataAfter,oRange.end.toString());
	}

	/**
	 * Zooms the 'range' object.
	 * @param plusmin
	 */
	function rangeZoom(plusmin){
		var fRangeGrowRate = 0.01111*oSpan.duration<<0
			,iStart = oRange.start.ago
			,iEnd = oRange.end.ago
			,iNewStart = iStart + (plusmin?fRangeGrowRate:-fRangeGrowRate)
			,iNewEnd = iEnd + (plusmin?-fRangeGrowRate:fRangeGrowRate)
		;
		if (iNewEnd<0) iNewEnd = 0;
		if (iNewStart>totaltimeline.UNIVERSE) iNewStart = totaltimeline.UNIVERSE;
		if (iNewEnd>iNewStart) {
			iNewStart = iStart;
			iNewEnd = iEnd;
		}
		oRange.start.set(iNewStart,false);
		oRange.end.set(iNewEnd);
	}

	/**
	 * Moves the 'range' object.
	 * @param x
	 */
	function rangeMove(x){
		var iSpanWidth = mSpan.offsetWidth
			,iRangeWidth = mRange.offsetWidth
			,iNewLeft = Math.min(Math.max(x-iMouseXOffset,0),iSpanWidth-iRangeWidth)
			,fPartLeft = iNewLeft/iSpanWidth
			,iNewStart = oSpan.duration - Math.floor(fPartLeft*oSpan.duration);
		oRange.moveStart(iNewStart);
	}

	/**
	 * Turns a floating point into a percentage.
	 * @param float
	 * @returns {string}
	 */
	function getPercentage(float){
		return 100*float+'%';
	}

	return init;
})(iddqd));