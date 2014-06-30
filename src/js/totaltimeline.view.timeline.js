/**
 * @name timeline
 * @namespace totaltimeline.view
 */
iddqd.ns('totaltimeline.view.timeline',(function(){
	'use strict';

	var s = totaltimeline.string
//		,time = totaltimeline.time
		,collection = totaltimeline.collection
		,model
		,signals = iddqd.signals
		,keys
		,oRange
		,aEvents
		,aPeriods
		,mView
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

		collection.forEach(function(col){
			col.dataLoaded.add(handleRangeChange);
		});
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
	function handleWheel(direction,e){
		if (bOver) {
			var fScale = 0.01,iNewStart,iNewEnd
				,bZoomin = direction>0
				,iZoomin = bZoomin?1:-1
				,iStart = oRange.start.ago
			;
			if (keys[16]) {
				iNewStart = iStart + iZoomin*(fScale*oRange.duration<<0);
				oRange.moveStart(iNewStart);
			} else {
				var fAdd = iZoomin*(0.01*oRange.duration<<0);
				// offset calculations
				var iViewL = mView.offsetLeft // todo: cache value on resize and check property
					,iViewW = mView.offsetWidth // todo: cache value on resize and check property
					,iMouseX = e.clientX
					,fL = (iMouseX-iViewL)/iViewW
					,fR = 1-fL
				;
				/*if (!bZoomin) {
					if (iStart<=time.UNIVERSE) {
						fL = 0;
						fR = -1;
					}
				}*/
				// new position
				iNewStart = oRange.start.ago - 0.5*fL*fAdd;
				iNewEnd = oRange.end.ago + 0.5*fR*fAdd;
//				console.log('fMouseX',fL); // log
				////
//				iNewStart = oRange.start.ago - fAdd;
//				iNewEnd = oRange.end.ago + fAdd;
				oRange.set(iNewStart,iNewEnd);
				//oRange.start.set(iNewStart,false);
				//oRange.end.set(iNewEnd);
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
		collection.forEach(function(col){
			col.populate(mView,oRange);
		});
	}

	return init;
})());