/**
 * An object instance created by the factory method {@link totaltimeline.time.eventInfo}
 * @typedef {object} eventInfo
 * @property {string} name
 * @property {string} icon
 * @property {string} importance
 * @property {string} accuracy
 *
 * @property {string} explanation
 * @property {string} wikimediakey
 * @property {string} wikimedia
 *
 * @property {string} image
 * @property {string} thumb
 * @property {string} imagename
 * @property {string} imageinfo
 *
 * @property {string} example
 * @property {string} links
 * @property {string} remark
 *
 * @property {function} parse
 */
/**
 * Factory method for creating an eventInfo object.
 * @name totaltimeline.time.eventInfo
 * @method
 * @param {object} objectToParse
 * @returns {eventInfo}
 */
iddqd.ns('totaltimeline.time.eventInfo',function(objectToParse){
	'use strict';
	var _ = (function(u){return u;})()
		,slug = totaltimeline.util.slug
		,oEventInfo = {
			name:_
			,slug:_
			,icon:_
			,importance:_
			,accuracy:_
			,tags:[]

			,explanation:_
			,wikimediakey:_
			,wikimedia:_

			,image:_
			,thumb:_
			,imagename:_
			,imageinfo:_

			,example:_
			,links:_
			,remark:_

			,parse: parse
		}
	;

	// todo: document
	function parse(o) {
		// todo: markdown.toHTML(explanation)
		for (var s in o) {
			if (oEventInfo.hasOwnProperty(s)) {
				oEventInfo[s] = o[s];
				if (s==='name') {
					oEventInfo.slug = slug(o[s]);
				} else if (s==='tags') {
					oEventInfo.tags = o[s].split(',').map(function(s){return s.replace(/^\s*|\s*$/g,'');}).filter(function(s){return !s.match(/^[\s\n\t]*$/);});
				}
			}
		}
		return oEventInfo;
	}
	return objectToParse?oEventInfo.parse(objectToParse):oEventInfo;
});
