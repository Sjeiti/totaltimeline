/**
 * @name model
 * @namespace totaltimeline
 */
iddqd.ns('totaltimeline.model',(function(){
	'use strict';

	var time = totaltimeline.time
		,moment = time.moment
		,range = time.range
		,event = time.event
		//,period = time.period
		,eventInfo = time.eventInfo
		//
		// see: https://developers.google.com/gdata/samples/spreadsheet_sample
		// see: https://developers.google.com/google-apps/spreadsheets/
		//,sSpreadsheetKey = '0AgLsBMvUgAW8dE1ZRDJUOVliVnFwNE9DcGRmNHRIbWc'
		,bUseCache = !true
		,sSpreadsheetKey = '0AgLsBMvUgAW8dEZBWkNXYkRrQ09IVHBrV0NUNTVsTHc'
		//,sSpreadsheetUri = 'http://spreadsheets.google.com/tq?key='+sSpreadsheetKey
		//,sSpreadsheetUri = 'https://spreadsheets.google.com/feeds/list/key/od6/public/basic?alt=rss'.replace(/key/,sSpreadsheetKey)
		,sSpreadsheetUri = 'https://spreadsheets.google.com/feeds/list/key/od6/public/values?alt=json-in-script'.replace(/key/,sSpreadsheetKey)
		//
		,oSpan = range(moment(time.UNIVERSE),moment(time.NOW))
		//,oRange = range(moment(5.3E9),moment(4.3E8))
		,oRange = range(moment(time.UNIVERSE),moment(time.NOW))
		,aEvents = []
		,sgEventsLoaded = new signals.Signal()
	;

	function init(){
		getTimelineEvents(handleTimelineEvents);
	}

	function getTimelineEvents(callback){
		if (bUseCache) {
			window.rvjsonp2223 = callback;
			iddqd.network.xhttp('data/cache.json',function(request){
				/*jshint evil:true*/eval(request.response);/*jshint evil:false*/
				delete window.rvjsonp2223;
			});
		} else {
			iddqd.network.jsonp(sSpreadsheetUri,callback);
		}
	}

	/**
	 * Turns the spreadsheet json data into an event list.
	 * @param {object} sheet
	 */
	function handleTimelineEvents(sheet){
		//ago, since, year, name, example, exclude, importance, explanation, link, accuracy, remark
		var sPrefix = 'gsx$'
			,sPropprop = '$t'
			,aEntries = sheet.feed.entry
		;
		function getProp(entry,prop,int){
			var sProp = entry[sPrefix+prop]
				,sValue = sProp?sProp[sPropprop]:'';
			(sProp===undefined)&&console.warn(prop+' not present');
			return int===true?parseInt(sValue,10):sValue;
		}
		aEntries.forEach(function(entry){
			var  iAgo =		getProp(entry,'ago',true)
				,iSince =	getProp(entry,'since',true)
				,iYear =	getProp(entry,'year',true)
				,oMoment = iAgo?moment(iAgo):(iSince?moment(iSince,moment.SINCE):iYear&&moment(iYear,moment.YEAR))
			;
			if (oMoment) {
				aEvents.push(event(
					oMoment
					,eventInfo(
						 getProp(entry,'name')
						,getProp(entry,'explanation')
						,getProp(entry,'importance')
						,getProp(entry,'example')
						,getProp(entry,'link')
						,getProp(entry,'remark')
						,getProp(entry,'accuracy')
						,getProp(entry,'icon')
					)
				));
			}
		});
		// sort events by ago
		aEvents.sort(function(eventA,eventB){
			return eventA.moment.ago>eventB.moment.ago?-1:1;
		});
		sgEventsLoaded.dispatch();
	}
	/*function handleTimelineEvents(data){
		//var aCols = ['ago','since','year','event','example','exclude','importance','explanation','link','accuracy','time remark'];
		data.table.rows.forEach(function(row){
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
		sgEventsLoaded.dispatch();
	}*/

	return iddqd.extend(init,{
		span: oSpan
		,range: oRange
		,events: aEvents
		,eventsLoaded: sgEventsLoaded
	});
})());