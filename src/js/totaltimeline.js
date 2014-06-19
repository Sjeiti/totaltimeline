/**
 * @name totaltimeline
 * @namespace totaltimeline
 * @version 0.0.1
 * @author Ron Valstar (http://www.sjeiti.com/)
 * @copyright Ron Valstar <ron@ronvalstar.nl>
 */
iddqd.ns('totaltimeline',(function(iddqd){
	'use strict';

	var totaltimeline = {
			YEAR_NOW: (new Date()).getFullYear()
			,UNIVERSE: 13798000000
		}
		// namespaces
		,moment,range,event,period,eventInfo
		// ranges
		,oSpan
		,oRange
	;

	iddqd.onDOMReady(init);

	function init(){
		// normalise namespaces
		var time = totaltimeline.time;
		moment = time.moment;
		range = time.range;
		event = time.event;
		period = time.period;
		eventInfo = time.eventInfo;
		//
		initModel();
		initView();
	}

	function initModel(){
		// async get timeline data
		// range data
		totaltimeline.start = moment(totaltimeline.UNIVERSE); //?
		totaltimeline.end = moment(0); //?
		oSpan = range(moment(totaltimeline.UNIVERSE),moment(0));
		oRange = range(moment(5.3E9),moment(4.3E8));
	}

	function initView(){
		totaltimeline.view.overview(oSpan,oRange);
		totaltimeline.view.timeline(oRange);
	}

	return totaltimeline;
})(iddqd));