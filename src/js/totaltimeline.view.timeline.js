/**
 * @namespace totaltimeline.view.timeline
 */
iddqd.ns('totaltimeline.view.timeline',(function(){
	'use strict';

	var s = totaltimeline.string
		,view = totaltimeline.view
		//,log = totaltimeline.view.log
		,collection = totaltimeline.collection
		,signals = iddqd.signals
		,keys
		,oRange
		//
		,mBody
		,mView
		,mOverlay
		,mTimeFrom
		,mTimeTo
		//
		,iBgPos = 0
		//
		,iViewW
		,iViewH
		,iViewL
		,bOver = false
		,aTouchXLast = []
		//
		,bViewMouseDown = false
		,iMouseXOffsetDelta = 0
		,iMouseXOffsetLast = 0
	;

	function init(model){
		initVariables(model);
		if (mView) {
			initEvents();
			initView();
		}
	}

	/**
	 * Initialise Variables
	 * @param {model} model
	 */
	function initVariables(model){
		oRange = model.range;
		// view elements
		mBody = document.body;
		mView = document.getElementById('timeline');
		mOverlay = zen('div.overlay').pop();
		mTimeFrom = document.createElement('time');
		mTimeTo = document.createElement('time');
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
		[s.mouseover,s.mouseout,s.mousemove].forEach(function(event){
			mView.addEventListener(event,handleSpanMouse,false);
		});
		// drag
		mView.addEventListener(s.mousedown,handleViewMouseClick,false);
		mBody.addEventListener(s.mousemove,handleBodyMouseMove,false);
		mBody.addEventListener(s.mouseup,handleViewMouseClick,false);
		// wheel
		signals.mousewheel.add(handleWheel);
		// collection
		collection.forEach(function(col){
			col.dataLoaded.add(handleRangeChange);
		});
		// touch
		mView.addEventListener(s.touchstart,handleTouchStart,false);
		mView.addEventListener(s.touchmove,handleTouchMove,false);
		// range
		oRange.change.add(handleRangeChange);
		oRange.change.add(moveBackgroundOverlay);
	}

	/**
	 * Initialise view
	 */
	function initView(){
		mView.appendChild(mTimeFrom);
		mView.appendChild(mTimeTo);
		mView.appendChild(mOverlay);
		handleResize();
		handleRangeChange();
	}

	/**
	 * Handle resize Signal
	 * Cache view element size on resize
	 */
	function handleResize(){//ow,oh,w,h
		iViewW = mView.offsetWidth;
		iViewH = mView.offsetHeight;
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
	 * Handles click event. Determines when the mouse is down and stores the offset with the target.
	 * @param e
	 */
	function handleViewMouseClick(e){
		bViewMouseDown = e.type===s.mousedown;
		if (bViewMouseDown) {
			iMouseXOffsetDelta = 0;
			iMouseXOffsetLast = e.clientX;//.offsetX;
		}
	}

	/**
	 * Handles move event and moves mRange if the mouse is down.
	 * @param e
	 */
	function handleBodyMouseMove(e){
		if (bViewMouseDown) {
			var iOffsetX = e.clientX;
			iMouseXOffsetDelta = iOffsetX-iMouseXOffsetLast;
			iMouseXOffsetLast = iOffsetX;
			if (iMouseXOffsetDelta!==0) { // otherwise stuff gets re-added due to inefficient population (causing click events not to fire)
				oRange.moveStart(oRange.start.ago + Math.round(iMouseXOffsetDelta/mView.offsetWidth*oRange.duration));
			}
		}
	}

	/**
	 * Handles the wheel event to zoom or move mRange.
	 * @param {number} direction Corresponds to wheelDelta
	 * @param {Event} e The WheelEvent
	 */
	function handleWheel(direction,e){
		if (bOver) {
			var fScaleMove = 0.02
				,fScaleZoom = 0.1
				,iNewStart
				,iNewEnd
				,bZoomin = direction>0
				,iZoomin = bZoomin?1:-1
				,iStart = oRange.start.ago
			;
			if (keys[16]) {
				iNewStart = iStart + iZoomin*(fScaleMove*oRange.duration<<0);
				oRange.moveStart(iNewStart);
			} else {
				var fAdd = iZoomin*(fScaleZoom*oRange.duration<<0)
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
	function handleRangeChange(){ // todo: possibly refactor since also called by collection -> col.dataLoaded
		mTimeFrom.innerText = oRange.start.toString();
		mTimeTo.innerText = oRange.end.toString();
		mView.style.backgroundImage = view.rangeGradient;
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
		var touches = e.touches
			,iX = touches.length
			,aTouchX = []
			,iXLast = aTouchXLast.length
		;
		for (var i=0;i<iX;i++) {
			aTouchX.push(touches[i].pageX);
		}
		// sort if length===2: old fashioned swap is way faster than sort: http://jsperf.com/array-length-2-sort
		if (iX===2&&aTouchX[0]>aTouchX[1]) {
			var tmp = aTouchX[0];
			aTouchX[0] = aTouchX[1];
			aTouchX[1] = tmp;
		}

		if (iX===iXLast) {
			if (iX===1) {
				oRange.moveStart(oRange.start.ago+(aTouchX[0]-aTouchXLast[0])*(oRange.duration/mView.offsetWidth));
				e.preventDefault();
			} else if (iX===2) {
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

	// todo: document
	function moveBackgroundOverlay(range,oldrange){
		var iCurrentDuration = range.duration
			,iRangeCenter = range.end.ago + iCurrentDuration/2
			,iOldRangeCenter = oldrange.end.ago + oldrange.duration/2
			,iDeltaCenter = iRangeCenter - iOldRangeCenter
			,iOffset = iDeltaCenter/iCurrentDuration*iViewW
		;
		// background-size is contain so mod by iViewH to prevent errors
		iBgPos = (iBgPos + Math.round(iOffset))%iViewH;
		mOverlay.style.backgroundPosition = iBgPos+'px 0';
	}

	return init;
})());