/**
 * @namespace totaltimeline.model
 */
iddqd.ns('totaltimeline.model',(function(undefined){
	'use strict';

	var time = totaltimeline.time
		,moment = time.moment
		,range = time.range
		,sgEntryShown = new signals.Signal()
		//
		,sUserAgent = navigator.userAgent
		//
		// see: https://developers.google.com/gdata/samples/spreadsheet_sample
		// see: https://developers.google.com/google-apps/spreadsheets/
		//,sSpreadsheetKey = '0AgLsBMvUgAW8dE1ZRDJUOVliVnFwNE9DcGRmNHRIbWc'
		//,bUseCache = !true
//		,sSpreadsheetKey = '0AgLsBMvUgAW8dEZBWkNXYkRrQ09IVHBrV0NUNTVsTHc'
		,sSpreadsheetKey = '1wn2bs7T2ZzajyhaQYmJvth3u2ikZv10ZUEpvIB9iXhM'
		//
		,oSpan = range(moment(time.UNIVERSE),moment(time.NOW))
		//,oRange = range(moment(5.3E9),moment(4.3E8))
		,oRange = range(moment(time.UNIVERSE),moment(time.NOW),moment(time.UNIVERSE))
	;

	function init(){
		totaltimeline.collection.forEach(function(collection){
			collection.getData();
		});
	}

	// todo:document
	function getCssValuePrefix() {
		var aPrefixes = ['', '-o-', '-ms-', '-moz-', '-webkit-']
			,mTmp = document.createElement('div')
			,sValue = 'linear-gradient(left, #fff, #fff)';
		for (var i = 0; i < aPrefixes.length; i++) {
			mTmp.style.backgroundImage = aPrefixes[i] + sValue;
			if (mTmp.style.backgroundImage) {
				return aPrefixes[i];
			}
			mTmp.style.backgroundImage = '';
		}
	}

	return iddqd.extend(init,{
		span: oSpan
		,range: oRange
		,spreadsheetKey: sSpreadsheetKey
		,entryShown: sgEntryShown
		,cssPrefix: getCssValuePrefix()
		,userAgent: {
			isPhantom: sUserAgent.match(/PhantomJS/)
		}
	});
})());