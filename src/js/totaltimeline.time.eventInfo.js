/*global markdown*/
/**
 * An object instance created by the factory method {@link totaltimeline.time.eventInfo}
 * @typedef {object} eventInfo
 * @property {string} name
 * @property {string} explanation
 * @property {string} importance
 * @property {string} example
 * @property {string} link
 * @property {string} remark
 * @property {string} accuracy
 * @property {string} icon
 */
/**
 * Factory method for creating an eventInfo object.
 * @name totaltimeline.time.eventInfo
 * @method
 * @returns {eventInfo}
 */
iddqd.ns('totaltimeline.time.eventInfo',function(
	name
	,explanation
	,importance
	,example
	,link
	,remark
	,accuracy
	,icon
	,wikimediakey
	,wikimedia
	,image
	,imageinfo
){
	'use strict';
	console.log('explanation',explanation); // log
	return {
		name: name
		,explanation: explanation===''||explanation===undefined?'':markdown.toHTML(explanation)
		,importance: importance
		,example: example
		,link: link
		,remark: remark
		,accuracy: accuracy
		,icon: icon
		,wikimediakey: wikimediakey
		,wikimedia: wikimedia===''||wikimedia===undefined?'':txtwiki.parseWikitext(wikimedia).replace('&nbsp;',' ')
		,image: image
		,imageinfo: imageinfo
	};
});