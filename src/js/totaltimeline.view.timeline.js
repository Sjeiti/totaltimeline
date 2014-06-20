/**
 * @name timeline
 * @namespace totaltimeline.view
 */
iddqd.ns('totaltimeline.view.timeline',(function(iddqd){
	'use strict';

	var s = totaltimeline.string
		,model
		,oRange
		,aEvents
		,mView
	;

	function init(_model){
		model = _model;
		oRange = model.range;
		aEvents = model.events;
		mView = document.getElementById('timeline');
		oRange.change.add(handleRangeChange);
		model.eventsLoaded.add(handleRangeChange);
		handleRangeChange();
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
			if (iStarted===0&&iAgo<=iRangeStart) {
				iStarted++;
			}
			if (iStarted===1) {
				if (iAgo<iRangeEnd) {
					break;
				} else {
					var mEvent = oEvent.element
						,fRel = 1-((iAgo-iRangeEnd)/iDuration)
					;
					mEvent.style.left = s.getPercentage(fRel);
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

	return init;
})(iddqd));