/**
 * @name timeline
 * @namespace totaltimeline.view
 */
iddqd.ns('totaltimeline.view.timeline',(function(iddqd){
	'use strict';

	var s = totaltimeline.string
		,oRange
		,mView
//		,mRange
//		,fRangeWidth
//		,fRangeStart
	;

	function init(range){
		oRange = range;
		mView = document.getElementById('timeline');
		oRange.change.add(handleRangeChange);
		handleRangeChange();
//		mRange = zen('div.range').pop();
//		mView.appendChild(mRange);
		//
//		console.log('span.duration',span.duration); // log
//		console.log('range.duration',range.duration); // log
//		//
//		fRangeWidth = range.duration/span.duration;
//		fRangeStart = 1-range.start.ago/span.duration;
//		console.log('fRangeWidth',fRangeWidth); // log
//		console.log('fRangeStart',fRangeStart); // log
//		mRange.style.width = getPercentage(fRangeWidth);
//		mRange.style.left = getPercentage(fRangeStart);
//		mView.setAttribute('data-start',range.start.toString());
//		mView.setAttribute('data-end',range.end.toString());
	}

	function handleRangeChange(){
		mView.setAttribute(s.dataBefore,oRange.start.toString());
		mView.setAttribute(s.dataAfter,oRange.end.toString());
	}

//	function getPercentage(float){
//		return 100*float+'%';
//	}

	return init;
})(iddqd));