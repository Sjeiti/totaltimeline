/**
 * @name timeline
 * @namespace totaltimeline.view
 */
iddqd.ns('totaltimeline.view.timeline',(function(){
	'use strict';

	var s = totaltimeline.string
		,model
		,signals = iddqd.signals
		,keys
		,oRange
		,aEvents
		,aPeriods
		,mView
		,mEvents,mPeriods
		,bOver = false
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
		model = _model;
		oRange = model.range;
		aEvents = model.events;
		aPeriods = model.periods;
		mView = document.getElementById('timeline');
		mPeriods = addView(mView,'periods');
		mEvents = addView(mView,'events');
		// init and detach keypress so keys exist
		signals.keypress.add(iddqd.fn).detach();
		keys = signals.keypress.keys;
	}

	/**
	 * Initialise event listeners (and signals).
	 */
	function initEvents(){
		[s.mouseover,s.mouseout,s.mousemove].forEach(function(event){
			mView.addEventListener(event,handleSpanMouse,false);
		});
		signals.mousewheel.add(handleWheel);
		oRange.change.add(handleRangeChange);
		model.eventsLoaded.add(handleRangeChange);
		model.periodsLoaded.add(handleRangeChange);
	}

	/**
	 * Initialise view
	 */
	function initView(){
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
	 * Handles the wheel event to zoom or move mRange.
	 * @param {number} direction Corresponds to wheelDelta
	 * @param {Event} e The WheelEvent
	 */
	function handleWheel(direction){//,e
		if (bOver) {
			var fScale = 0.01,iNewStart,iNewEnd;
			if (keys[16]) {
				iNewStart = oRange.start.ago + (direction>0?1:-1)*(fScale*oRange.duration<<0);
				oRange.moveStart(iNewStart);
			} else {
				var fAdd = (direction>0?1:-1)*(0.01*oRange.duration<<0);
				iNewStart = oRange.start.ago - fAdd;
				iNewEnd = oRange.end.ago + fAdd;
				oRange.start.set(iNewStart,false);
				oRange.end.set(iNewEnd);
			}
			// todo: add mouseOffset as in overview (refactor dry)
//			if (keys[16]) rangeMove(mRange.offsetLeft+(direction>0?2:-2)+iMouseXOffset);
//			else rangeZoom(direction>0,e.clientX);
		}
	}

	/**
	 * When the range changes all view element are recalculated
	 */
	function handleRangeChange(){
		mView.setAttribute(s.dataBefore,oRange.start.toString());
		mView.setAttribute(s.dataAfter,oRange.end.toString());
		//
		var iRangeStart = oRange.start.ago
			,iRangeEnd = oRange.end.ago
			,iDuration = oRange.duration
		;
		populateEvents(0,iRangeStart,iRangeEnd,iDuration);
		populatePeriods(iRangeEnd,iDuration);
	}

	function populateEvents(started,rangeStart,rangeEnd,duration){
		var mFragment = document.createDocumentFragment();
		emptyView(mEvents);
		for (var i=0,l=aEvents.length;i<l;i++) {
			var oEvent = aEvents[i]
				,iAgo = oEvent.moment.ago;
			if (started===0&&iAgo<=rangeStart) {
				started++;
			}
			if (started===1) {
				if (iAgo<rangeEnd) {
					break;
				} else {
					var mEvent = oEvent.element
						,fRel = 1-((iAgo-rangeEnd)/duration)
					;
					mEvent.style.left = s.getPercentage(fRel);
					mFragment.appendChild(mEvent);
				}
			}
		}
		mEvents.appendChild(mFragment.cloneNode(true));
	}

	function populatePeriods(rangeEnd,duration){
		var mFragment = document.createDocumentFragment();
		emptyView(mPeriods);
		aPeriods.forEach(function(period){
			if (period.coincides(oRange)) {
				var mPeriod = period.element
					,iAgo = period.range.start.ago
					,fRelLeft = 1-((iAgo-rangeEnd)/duration)
					,fRelWidth = period.range.duration/duration
				;
				mPeriod.style.left = s.getPercentage(fRelLeft);
				mPeriod.style.width = s.getPercentage(fRelWidth);
				mFragment.appendChild(mPeriod);
//				if (period.children.length) {
//					period.children.forEach(function(){
//						mPeriod.appendChild()
//					});
//				}
			}
		});
		mPeriods.appendChild(mFragment.cloneNode(true));
	}

	function addView(parent,className){
		var mElm = document.createElement('div');
		mElm.classList.add(className);
		parent.appendChild(mElm);
		return mElm;
	}

	function emptyView(view){
		while (view.childNodes.length) {
			view.removeChild(view.firstChild);
		}
	}

	return init;
})());