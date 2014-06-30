/**
 * Sting objects and methods.
 * @name string
 * @namespace totaltimeline
 */
iddqd.ns('totaltimeline.string',(function(){
	'use strict';

	var time = totaltimeline.time
		,sSpace = ' '
		,aAnnum = 'a,ka,Ma,Ga'.split(',')
		,aDuration = ' kMGTP'.split('')
	;

	/**
	 * Turns a floating point into a percentage.
	 * @param float
	 * @returns {string}
	 */
	function getPercentage(float){
		return 100*float+'%';
	}

	/**
	 * Textual representation of annum.
	 * Years are rounded and represented in a, ka, Ma and Ga.
	 * Years greater than 2000 BC are written in Gregorian style with BC/AD suffix.
	 * Years greater than 1500 AD are written without suffix.
	 * @param {number} year
	 * @param {number} round
	 * @returns {string}
	 */
	function formatAnnum(year,round,space){
		// todo: rounding sometimes off: split at . truncate and join
		space = space===false?'':sSpace;
		var sReturn;
		if (year>4000) {
			//var i = year;
			if (round===undefined) round = 0;
			for (var i = 0; year>1000 && (aAnnum.length>=(i + 2)); i++) year /= 1000;
			var iMult = Math.pow(10,round);
			sReturn = (Math.round(year * iMult) / iMult) +space+ aAnnum[i];
		} else {
			year = Math.round(time.YEAR_NOW-year);
			sReturn = Math.abs(year) +space+ (year<0?'BC':(year<1500?'AD':''));
		}
		return sReturn;
	}

	/**
	 * Textual representation of duration
	 * @param {number} years
	 * @param {number} round
	 * @returns {string}
	 */
	function duration(years,round){
		// todo: rounding sometimes off: split at . truncate and join
		if (round===undefined) round = 0;
		for (var i = 0; years>1000 && (aDuration.length>=(i + 2)); i++) years /= 1000;
		var iMult = Math.pow(10,round);
		return (Math.round(years * iMult) / iMult) +sSpace+ aDuration[i] +sSpace+ 'years';
	}

	return {
		dataBefore: 'data-before'
		,dataAfter: 'data-after'
		,mouseover: 'mouseover'
		,mouseout: 'mouseout'
		,mousemove: 'mousemove'
		,mousedown: 'mousedown'
		,mouseup: 'mouseup'
		,drag: 'drag'
		,click: 'click'
		,getPercentage: getPercentage
		,formatAnnum: formatAnnum
		,duration: duration
	};
})());