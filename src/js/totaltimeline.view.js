/**
 * @namespace totaltimeline.view
 * @param {model} model
 */
iddqd.ns('totaltimeline.view',(function(){
	'use strict';

	var s = totaltimeline.string
		,time = totaltimeline.time
		,aBackgroundColors = [
			 {time:time.UNIVERSE,					color:'#171B30'}//171B30
			,{time:time.UNIVERSE-800E6,				color:'#585873'}//585873
			,{time:time.UNIVERSE-801E6,				color:'#799193'}//CCE7E7
			,{time:Math.floor(0.8*time.UNIVERSE),	color:'#2E4346'}
			,{time:Math.floor(0.4*time.UNIVERSE),	color:'#657851'}
			,{time:time.NOW,						color:'#D8945A'}
			,{time:-1E9,							color:'#8A5246'}
			,{time:-9E9,							color:'#460505'}
		]
	;

	function init(model){
		initVariables();
		initEvents(model);
		initView(model);
	}

	/**
	 * Initialise variables
	 */
	function initVariables(){
		init.rangeGradient = '';
	}

	/**
	 * Initialise event listeners (and signals).
	 */
	function initEvents(model){
		model.range.change.add(handleRangeChange.bind(model,model),-1);

	}

	/**
	 * Initialise views
	 */
	function initView(model){
		init.overview(model);
		init.timeline(model);
		init.content(model);
	}

	// todo: document
	function handleRangeChange(model,range){
		setGradient(model,range);
	}

	// todo: document
	function setGradient(model,range){
		var iAgoFrom = range.start.ago
			,iAgoTo = range.end.ago
			,iDeltaRange = range.duration
			,aGradient = [];
		for (var i=0,l=aBackgroundColors.length;i<l;i++) {
			var oColor = aBackgroundColors[i]
				,iTime = oColor.time;
			if (true||iTime<=iAgoFrom&&iTime>=iAgoTo) {
				//console.log('color',iTime,1-(iTime-iAgoTo)/iDeltaRange); // log
				var fPos = s.getPercentage(1-(iTime-iAgoTo)/iDeltaRange);
				aGradient.push(oColor.color+' '+fPos);
			}
		}
		init.rangeGradient = model.cssPrefix+'linear-gradient(left,'+aGradient.join(',')+')';
		//mView.style.backgroundImage = '-webkit-linear-gradient(left, #171B30 0%, #2E4346 33%, #657851 66%, #D8945A 100%)';
		//console.log('backgroundImage: ','-webkit-linear-gradient(left,'+aGradient.join(',')+')'); // log
	}

	return init;
})());