/**
 * An object instance created by the factory method {@link totaltimeline.time.moment}
 * @typedef {object} moment
 * @property {function} set
 * @property {string} type The type of the moment. Can be totaltimeline.time.moment.AGO
 * @property {Signal} change Signal dispatched when the value of the moment changes
 * @property {function} clone Clone the moment object.
 * @property {function} factory Direct link back to the original factory
 */
/*
 * A single moment in time
 * @namespace totaltimeline.time.moment
 * @property {function} set
 */
/*
 * @constant {string} SINCE
 * @constant {string} AGO
 * @constant {string} YEAR
 */
/**
 * A single moment in time
 * @name totaltimeline.time.moment
 * @method
 * @param {number} value
 * @param {string} type
 * @returns {moment}
 */
iddqd.ns('totaltimeline.time.moment',(function(){
	'use strict';

	// todo: refactor
	var time = totaltimeline.time;

	/**
	 * @param {number} value The time value.
	 * @param {string} [type=moment.AGO] Denotes what type of value is parsed: moment.AGO, moment.SINCE or moment.YEAR.
	 */
	function moment(value,type){
		var iAgo
			,iYear
			,iSince
			,change = new signals.Signal()
			,oReturn = iddqd.factory(moment,{
				toString: toString
				,type:type
				,set:set
				,change:change
				,clone:clone
			})
		;
		//
		set(value);
		//
		function set(value,dispatch){
			// todo: update return value
			oReturn.value = value;
			if (type===moment.SINCE) {
				oReturn.ago = iAgo = sinceToAgo(value);
				oReturn.year = iYear = sinceToYear(value);
				oReturn.since = iSince = value;
			} else if (type===moment.YEAR) {
				oReturn.ago = iAgo = yearToAgo(value);
				oReturn.year = iYear = value;
				oReturn.since = iSince = yearToSince(value);
			} else {
				if (type===undefined) {
					type = moment.AGO;
				}
				oReturn.ago = iAgo = value;
				oReturn.year = iYear = agoToYear(value);
				oReturn.since = iSince = agoToSince(value);
			}
			if (dispatch||dispatch===undefined) change.dispatch(iAgo);
			return oReturn;
		}
		function toString(){
			return time.formatAnnum(iAgo,2);
			//return '[moment '+value+' '+type+']';
		}
		function clone() {
			return moment(oReturn.ago);
		}
		//
		return oReturn;
	}

	// todo: refactor
	function agoToYear(value){		return time.YEAR_NOW-value; }
	function agoToSince(value){		return time.UNIVERSE-value; }
	function yearToAgo(value){		return time.YEAR_NOW-value; }
	function yearToSince(value){	return time.UNIVERSE-value; }
	function sinceToAgo(value){		return time.UNIVERSE-value; }
	function sinceToYear(value){	return time.YEAR_NOW-(time.UNIVERSE-value); }

	return iddqd.extend(moment,{
		SINCE: 'since'
		,AGO: 'ago'
		,YEAR: 'year'
	});
})());