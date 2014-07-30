/**
 * @namespace totaltimeline.spreadsheetproxy
 */
iddqd.ns('totaltimeline.spreadsheetproxy',(function(iddqd,undefined){
	'use strict';

	var sEndpoint = 'https://spreadsheets.google.com/feeds/list/key/worksheet/public/values?'//alt=json-in-script'
		,oOptions = {
			alt: 'json-in-script'
			// {number} min-row
			// {number} max-row
			// {number} min-col
			// {number} max-col
			// {string} alt json-in-script
			// {string} callback Function name
		}
		,sPrefix = 'gsx$'
		,iPrefix = sPrefix.length
		,sPropprop = '$t'
	;


	// todo: document
	function getData(key,worksheet,callback,options){
		var sheetUri = sEndpoint
			.replace(/key/,key)
			.replace(/worksheet/,worksheet)
			+serialize(iddqd.extend(options||{},oOptions));
		iddqd.network.jsonp(sheetUri,handleGetData.bind(undefined,callback));
	}

	// todo: document
	function handleGetData(callback,sheet){
//		console.log('handleGetData',arguments); // log
		var aData = [];
		sheet.feed.entry.forEach(function(entry){
			//console.log('entry',entry); // log
			var oEntry = {
				id: entry.id[sPropprop].split('/').pop()
			};
			for (var key in entry) {
				if (key.substr(0,iPrefix)===sPrefix) {
					oEntry[key.substr(iPrefix)] = entry[key][sPropprop];
				}
			}
			aData.push(oEntry);
		});
		callback(aData);
		//return aData;
		//console.log('handleGetData',sheet,aData); // log
	}

	/**
	 * Serialize an object
	 * @param {Object} obj Subject.
	 */
	function serialize(obj) {
		var str = [];
		for (var p in obj)
			if (obj.hasOwnProperty(p)) {
				str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
			}
		return str.join('&');
	}

	return {
		getData: getData
	};
})(iddqd));