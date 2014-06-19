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
		// events
		,aEvents = []
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
		getTimelineEvents(handleTimelineEvents);
		// range data
//		totaltimeline.start = moment(totaltimeline.UNIVERSE); //?
//		totaltimeline.end = moment(0); //?
		oSpan = range(moment(totaltimeline.UNIVERSE),moment(0));
		oRange = range(moment(5.3E9),moment(4.3E8));
	}

	function initView(){
		totaltimeline.view.overview(oSpan,oRange);
		totaltimeline.view.timeline(oRange,aEvents);
	}

	function getTimelineEvents(callback){
		// cached jsonP
		window.sscallback_1V4XTMr3npxtXl3F5HuQ = callback;
		iddqd.network.xhttp('data/cache.json',function(request){
			/*jshint evil:true*/eval(request.response);/*jshint evil:false*/
			delete window.sscallback_1V4XTMr3npxtXl3F5HuQ;
		});
	}

	/**
	 * Turns the spreadsheet json data into an event list.
	 * @param data
	 */
	function handleTimelineEvents(data){
//		console.log('data',data); // log
		//age,age0,the year,event,example,exclude,importance,explanation,link,accuracy,time remark
//		var aCols = ['ago','since','year','event','example','exclude','importance','explanation','link','accuracy','time remark'];
		data.table.rows.forEach(function(row){
//			console.log('row.c',row.c[0].v,row.c[1].v,row.c[2].v); // log
			var rowc = row.c
				,oAgo = rowc[0]
				,oSince = rowc[1]
				,oYear = rowc[2]
				,oMoment = oAgo?moment(oAgo.v):(oSince?moment(oSince.v,moment.SINCE):oYear&&moment(oYear.v,moment.YEAR))
			;
			if (oMoment) {
				aEvents.push(event(
					oMoment
					,eventInfo(
						 rowc[3]&&rowc[3].v		// name
						,rowc[7]&&rowc[7].v		// explanation
						,rowc[6]&&rowc[6].v		// importance
						,rowc[4]&&rowc[4].v		// example
						,rowc[8]&&rowc[8].v		// link
						,rowc[10]&&rowc[10].v	// remark
						,rowc[9]&&rowc[9].v		// accuracy
					)
				));
			}
		});
		// sort events by ago
		aEvents.sort(function(eventA,eventB){
			return eventA.moment.ago>eventB.moment.ago?-1:1;
		});
		//
		console.log('aEvents',aEvents); // log
		console.log('aEvents[5].toString()',aEvents[5].moment.ago); // log
		console.log('aEvents[5].toString()',aEvents[5].toString()); // log
	}

	return totaltimeline;
})(iddqd));