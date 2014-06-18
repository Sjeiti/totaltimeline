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
			YEAR_NOW: (new Date).getFullYear()
			,UNIVERSE: 13798000000
		}
		,moment,range,event,period,eventInfo
		,oRangeOverview;

	iddqd.onDOMReady(init);

	function init(){
		moment = totaltimeline.time.moment;
		range = totaltimeline.time.range;
		event = totaltimeline.time.event;
		period = totaltimeline.time.period;
		eventInfo = totaltimeline.time.eventInfo;

//		var oBegin = event(
//			moment(13798000000)
//			,eventInfo('Big bang')
//		);
//		var oNow = event(
//			moment(0)
//			,eventInfo('Now')
//		);
//		var oBirth = event(
//			moment(1974,moment.YEAR)
//			,eventInfo('Birth')
//		);
//		console.log('oBegin',''+oBegin,oBegin); // log
//		console.log('oNow',''+oNow,oNow); // log
//		console.log('oBirth',''+oBirth,oBirth); // log
//		for (var i=0,l=10;i<l;i++) {
//			var year = Math.random()*Math.pow(5,i)<<0;
//			console.log('moment('+year+').toString()',moment(year).toString()); // log
//		}

		initModel();
		initView();
	}

	function initModel(){
		totaltimeline.start = moment(13798000000);
		totaltimeline.end = moment(0);
		oRangeOverview = range(moment(5.3E9),moment(4.3E8));
	}

	function initView(){
		totaltimeline.view.overview(
			range(moment(13798000000),moment(0))
//			,range(moment(13798000000-10),moment(10))
			,oRangeOverview
		);
		totaltimeline.view.timeline(
			oRangeOverview
		);
	}

	return totaltimeline;
})(iddqd));