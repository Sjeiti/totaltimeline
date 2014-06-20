/**
 * Sting objects and methods.
 * @name string
 * @namespace totaltimeline
 */
iddqd.ns('totaltimeline.string',(function(){
	'use strict';

	/**
	 * Turns a floating point into a percentage.
	 * @param float
	 * @returns {string}
	 */
	function getPercentage(float){
		return 100*float+'%';
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
		,getPercentage: getPercentage
	};
})());