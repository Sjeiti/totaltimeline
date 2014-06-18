/**
 * @name moment
 * @namespace totaltimeline.time
 */
iddqd.ns('totaltimeline.time.moment',(function(){
	'use strict';

	// todo: refactor
	var YEAR_NOW = totaltimeline.YEAR_NOW
		,UNIVERSE = totaltimeline.UNIVERSE;

	/**
	 *
	 * @param value
	 * @param type
	 */
	function moment(value,type){
		var iAgo
			,iYear
			,iSince
			,change = new signals.Signal()
			,oReturn = {
				toString: toString
				,type:type
				,set:set
				,change:change
			}
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
			return formatAnnum(iAgo,2);
			//return '[moment '+value+' '+type+']';
		}
		//
		return oReturn;
	}

	// todo: refactor
	function agoToYear(value){		return YEAR_NOW-value; }
	function agoToSince(value){		return UNIVERSE-value; }
	function yearToAgo(value){		return YEAR_NOW-value; }
	function yearToSince(value){	return UNIVERSE-value; }
	function sinceToAgo(value){		return UNIVERSE-value; }
	function sinceToYear(value){	return YEAR_NOW-(UNIVERSE-value); }

	/**
	 * Textual representation of annum.
	 * Years are rounded and represented in a, ka, Ma and Ga.
	 * Years greater than 2000 BC are written in Gregorian style with BC/AD suffix.
	 * Years greater than 1500 AD are written without suffix.
	 * @param {number} year
	 * @param {number} round
	 * @returns {string}
	 */
	function formatAnnum(year,round){
		var sReturn;
		if (year>4000) {
			var i = year;
			if (round===undefined) round = 0;
			var aSizes = [' a',' ka',' Ma',' Ga'];
			for (i = 0; year>1000 && (aSizes.length>=(i + 2)); i++) year /= 1000;
			var iMult = Math.pow(10,round);
			sReturn = (Math.round(year * iMult) / iMult) + aSizes[i];
		} else {
			year = YEAR_NOW-year;
			sReturn = Math.abs(year) + (year<0?' BC':(year<1500?' AD':''));
		}
		return sReturn;
	}

	return iddqd.extend(moment,{
		SINCE: 'since'
		,AGO: 'ago'
		,YEAR: 'year'
	});
})());