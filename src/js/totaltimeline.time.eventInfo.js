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
		,slug = totaltimeline.string.slug
		,oEventInfo = {
			name:_
			,slug:_
			,icon:_
			,importance:_
			,accuracy:_

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
				}
			}
		}
		return oEventInfo;
	}
	return objectToParse?oEventInfo.parse(objectToParse):oEventInfo;
});