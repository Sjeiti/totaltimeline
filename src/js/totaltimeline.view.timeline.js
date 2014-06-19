/**
 * @name timeline
 * @namespace totaltimeline.view
 */
iddqd.ns('totaltimeline.view.timeline',(function(iddqd){
	'use strict';

	var s = totaltimeline.string
		,oRange
		,aEvents
		,mView
//		,mRange
//		,fRangeWidth
//		,fRangeStart
	;

	function init(range,events){
		oRange = range;
		aEvents = events;
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
		//
		emptyView();
		//

		var iRangeStart = oRange.start.ago
			,iRangeEnd = oRange.end.ago
			,iStarted = 0
			,mFragment = document.createDocumentFragment()
			,iDuration = oRange.duration
		;
		for (var i=0,l=aEvents.length;i<l;i++) {
			var oEvent = aEvents[i]
				,iAgo = oEvent.moment.ago;
			if (iStarted===0&&iAgo<iRangeStart) {
				iStarted++;
			} else if (iStarted===1) {
				if (iAgo<iRangeEnd) {
					break;
				} else {
					var mEvent = document.createElement('div')
						,fRel = 1-((iAgo-iRangeEnd)/iDuration)// Math.random()//
						,oInfo = oEvent.info
					;
					mEvent.classList.add('event');
					mEvent.setAttribute('title',oInfo.name);
					mEvent.style.left = getPercentage(fRel);
					mEvent.style.top = getPercentage(iddqd.math.prng.random(iAgo));
					mFragment.appendChild(mEvent);
				}
			}
		}
		mView.appendChild(mFragment.cloneNode(true));
	}

	function emptyView(){
		while (mView.childNodes.length) {
			mView.removeChild(mView.firstChild);
		}
	}
	function getPercentage(float){
		return 100*float+'%';
	}

	return init;
})(iddqd));