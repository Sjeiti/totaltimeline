/**
 * @namespace totaltimeline.view.timeline
 */
iddqd.ns('totaltimeline.view.timeline',(function(){
	'use strict';

	var s = totaltimeline.string
		//,time = totaltimeline.time
		//,log = totaltimeline.view.log
		,collection = totaltimeline.collection
		,model
		,signals = iddqd.signals
		,keys
		,oRange
		,aEvents
		,aPeriods
		,mView
		,iViewW
		,iViewL
		,bOver = false
		,aTouchXLast = []
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
		signals.resize.add(handleResize);
		[s.mouseover,s.mouseout,s.mousemove].forEach(function(event){
			mView.addEventListener(event,handleSpanMouse,!false);
		});
		signals.mousewheel.add(handleWheel);
		oRange.change.add(handleRangeChange);
		//
		collection.forEach(function(col){
			col.dataLoaded.add(handleRangeChange);
		});
		//
		mView.addEventListener(s.touchstart,handleTouchStart,!false);
		mView.addEventListener(s.touchmove,handleTouchMove,false);
	}

	/**
	 * Initialise view
	 */
	function initView(){
		handleResize();
		handleRangeChange();
	}

	/**
	 * Handle resize Signal
	 * Cache view element size on resize
	 */
	function handleResize(){//ow,oh,w,h
		iViewW = mView.offsetWidth;
		iViewL = mView.offsetLeft;
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
				var fAdd = iZoomin*(0.01*oRange.duration<<0)
					// offset calculations
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
				oRange.set(iNewStart,iNewEnd);
			}
			// todo: refactor dry
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
		collection.populate(mView,oRange);
	}

	/**
	 * Handles touchstart event to scroll or zoom the timeline.
	 */
	function handleTouchStart() {
		aTouchXLast.length = 0;
	}

	/**
	 * Handles touchmove event to scroll or zoom the timeline.
	 * @param {Event} e
	 */
	function handleTouchMove(e) {
		var aTouchX = []
			,iX
			,iXLast = aTouchXLast.length
		;
		Array.prototype.forEach.call(e.touches,function(touch) {
			aTouchX.push(touch.pageX);
		});
		iX = aTouchX.length;
		if (iX===iXLast) {
			if (iX===1) {
				oRange.moveStart(oRange.start.ago+(aTouchX[0]-aTouchXLast[0])*(oRange.duration/mView.offsetWidth));
				e.preventDefault();
			} else if (iX===2) {
				if (aTouchX[0]>aTouchX[1]) {
					aTouchX.push(aTouchX.shift());
				}
				// reverse interpolation to find new start and end points
				var iRangeDuration = oRange.duration
					//
					,iTouch1Last = aTouchXLast[0]
					,iTouch2Last = aTouchXLast[1]
					,fTouch1LastTime = oRange.start.ago - (iTouch1Last/iViewW)*iRangeDuration
					,fTouch2LastTime = oRange.end.ago + (1-iTouch2Last/iViewW)*iRangeDuration
					,iTouchWLast = iTouch2Last-iTouch1Last
					,iTouchLastDuration = (iTouchWLast/iViewW)*iRangeDuration
					//
					,iTouch1 = aTouchX[0]
					,iTouch2 = aTouchX[1]
					,iTouchW = iTouch2-iTouch1
					//
					,fPart1 = iTouch1/iViewW
					,fPart2 = 1-iTouch2/iViewW
					,fPartW = iTouchW/iViewW
					//
					,fPart1W = fPart1/fPartW
					,fPart2W = fPart2/fPartW
					,fPart1WDuration = fPart1W*iTouchLastDuration
					,fPart2WDuration = fPart2W*iTouchLastDuration
					//
					,iNewStart =	Math.floor(fTouch1LastTime + fPart1WDuration)
					,iNewEnd =		Math.floor(fTouch2LastTime - fPart2WDuration)
				;
				//
				oRange.set(
					iNewStart
					,iNewEnd
				);
				e.preventDefault();
			}
		}
		aTouchXLast.length = 0;
		while (iX--) {
			aTouchXLast[iX] = aTouchX[iX];
		}
	}

	return init;
})());