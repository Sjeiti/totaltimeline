/**
 * @namespace totaltimeline.model
 */
iddqd.ns('totaltimeline.model',(function(undefined){
	'use strict';

	var time = totaltimeline.time
		,moment = time.moment
		,range = time.range
		//
		,sgEntryShown = new signals.Signal()
		//
		,sSpreadsheetKey = '1wn2bs7T2ZzajyhaQYmJvth3u2ikZv10ZUEpvIB9iXhM'
		//
		,sUserAgent = navigator.userAgent
		//
		,oSpan = range(moment(time.UNIVERSE),moment(time.NOW))
		,oRange = range(moment(time.UNIVERSE),moment(time.NOW),moment(time.UNIVERSE))
		//
		,oReturn = iddqd.extend(init,{
			span: oSpan
			,range: oRange
			,spreadsheetKey: sSpreadsheetKey
			,entryShown: sgEntryShown
			,cssPrefix: totaltimeline.util.getCssValuePrefix()
			,userAgent: {
				isPhantom: sUserAgent.match(/PhantomJS/)
			}
		})
	;

	function init(){
		totaltimeline.collection.forEach(function(collection){
			collection.getData();
		});
		totaltimeline.pages.getData(oReturn);
	}

	return oReturn;
})());