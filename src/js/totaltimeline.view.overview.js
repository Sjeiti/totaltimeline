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
		,bMouseDown = false
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
			mSpan.addEventListener(event,handleSpanMouseMove,false);
		});
		mRange.addEventListener(s.mousedown,handleMouseClick,false);
		mBody.addEventListener(s.mousemove,handleBodyMouseMove,false);
		mBody.addEventListener(s.mouseup,handleMouseClick,false);
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

	function handleSpanMouseMove(e){
		bOver = e.type!==s.mouseout;
	}

	function handleBodyMouseMove(e){
		bMouseDown&&rangeMove(e.clientX);
	}

	function handleMouseClick(e){
		bMouseDown = e.type===s.mousedown;
		if (bMouseDown) iMouseXOffset = e.offsetX;
	}

	function handleWheel(direction){
		if (bOver) {
			if (keys[16]) rangeMove(mRange.offsetLeft+(direction>0?2:-2)+iMouseXOffset);
			else rangeChange(direction>0);
		}
	}

	function handleRangeChange(){
		fRangeWidth = oRange.duration/oSpan.duration;
		fRangeStart = 1-oRange.start.ago/oSpan.duration;
		mRange.style.width = getPercentage(fRangeWidth);
		mRange.style.left = getPercentage(fRangeStart);
		mRange.setAttribute(s.dataBefore,oRange.start.toString());
		mRange.setAttribute(s.dataAfter,oRange.end.toString());
	}

	function rangeChange(plusmin){
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

	function rangeMove(x){
		var iSpanWidth = mSpan.offsetWidth
			,iRangeWidth = mRange.offsetWidth
			,iNewLeft = Math.min(Math.max(x-iMouseXOffset,0),iSpanWidth-iRangeWidth)
			,fPartLeft = iNewLeft/iSpanWidth
			,iNewStart = oSpan.duration - Math.floor(fPartLeft*oSpan.duration);
		oRange.moveStart(iNewStart);
	}

	function getPercentage(float){
		return 100*float+'%';
	}

	return init;
})(iddqd));