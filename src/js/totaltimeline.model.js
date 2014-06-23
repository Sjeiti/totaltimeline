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
		,period = time.period
		,eventInfo = time.eventInfo
		//
		,sPrefix = 'gsx$'
		,sPropprop = '$t'
		// see: https://developers.google.com/gdata/samples/spreadsheet_sample
		// see: https://developers.google.com/google-apps/spreadsheets/
		//,sSpreadsheetKey = '0AgLsBMvUgAW8dE1ZRDJUOVliVnFwNE9DcGRmNHRIbWc'
		,bUseCache = !true
		,sSpreadsheetKey = '0AgLsBMvUgAW8dEZBWkNXYkRrQ09IVHBrV0NUNTVsTHc'
		//,sSpreadsheetUri = 'http://spreadsheets.google.com/tq?key='+sSpreadsheetKey
		//,sSpreadsheetUri = 'https://spreadsheets.google.com/feeds/list/key/od6/public/basic?alt=rss'.replace(/key/,sSpreadsheetKey)
		,sSpreadsheetEventsUri = 'https://spreadsheets.google.com/feeds/list/key/od6/public/values?alt=json-in-script'.replace(/key/,sSpreadsheetKey)
		,sSpreadsheetPeriodsUri = 'https://spreadsheets.google.com/feeds/list/key/od7/public/values?alt=json-in-script'.replace(/key/,sSpreadsheetKey)
		//
		,oSpan = range(moment(time.UNIVERSE),moment(time.NOW))
		//,oRange = range(moment(5.3E9),moment(4.3E8))
		,oRange = range(moment(time.UNIVERSE),moment(time.NOW))
		,aEvents = []
		,sgEventsLoaded = new signals.Signal()
	;

	function init(){
		getTimelineEvents(handleTimelineEvents);
//		var a = range(moment(10),moment(0))
//			,b = moment(5)
//			,c = range(moment(8),moment(2))
//		;
//		console.log('a.start.toString()',a.start.toString()); // log
//		console.log('a.end.toString()',a.end.toString()); // log
//		console.log('a.surrounds(b)',a.surrounds(b)); // log
//		console.log('a.surrounds(c)',a.surrounds(c)); // log
	}

	function getTimelineEvents(callback){
		if (bUseCache) {
			window.rvjsonp2223 = callback;
			iddqd.network.xhttp('data/cache.json',function(request){
				/*jshint evil:true*/eval(request.response);/*jshint evil:false*/
				delete window.rvjsonp2223;
			});
		} else {
			iddqd.network.jsonp(sSpreadsheetEventsUri,callback);
			iddqd.network.jsonp(sSpreadsheetPeriodsUri,handleTimelinePeriods);
		}
	}

	function getProp(entry,prop,int){
		var sProp = entry[sPrefix+prop]
			,sValue = sProp?sProp[sPropprop]:'';
		(sProp===undefined)&&console.warn(prop+' not present');
		return int===true?parseInt(sValue,10):sValue;
	}

	/**
	 * Turns the spreadsheet json data into an event list.
	 * @param {object} sheet
	 */
	function handleTimelineEvents(sheet){
		//ago, since, year, name, example, exclude, importance, explanation, link, accuracy, remark
		sheet.feed.entry.forEach(function(entry){
			var  iAgo =		getProp(entry,'ago',true)
				,iSince =	getProp(entry,'since',true)
				,iYear =	getProp(entry,'year',true)
				,oMoment = iAgo?moment(iAgo):(iSince?moment(iSince,moment.SINCE):iYear&&moment(iYear,moment.YEAR))
				,bExclude = getProp(entry,'exclude')==='1'
			;
			if (oMoment&&!bExclude) {
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
	function handleTimelinePeriods(sheet){
		var aPeriods = [];
		sheet.feed.entry.forEach(function(entry){
			var iFrom = getProp(entry,'from',true)
				,iTo = getProp(entry,'to',true)
				,sName = getProp(entry,'name')
			;
			if (iFrom!==undefined&&iTo!==undefined&&sName!==undefined) {
				aPeriods.push(period(
					range(moment(iFrom),moment(iTo))
					,eventInfo(sName)
				));
			}
		});
		//
		aPeriods.forEach(function(period1){
			aPeriods.forEach(function(period2){
				if (period1!==period2&&period1.surrounds(period2)) {
					console.log(period1.info.name+' surrounds '+period2.info.name);
				}
			});
		});
	}

	return iddqd.extend(init,{
		span: oSpan
		,range: oRange
		,events: aEvents
		,eventsLoaded: sgEventsLoaded
	});
})());