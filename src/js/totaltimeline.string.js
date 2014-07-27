/**
 * Sting objects and methods.
 * @namespace totaltimeline.string
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
	 * @name totaltimeline.string.getPercentage
	 * @method
	 * @param float
	 * @returns {string}
	 */
	function getPercentage(float){
		return 100*float+'%';
	}

	return {
		/** @constant totaltimeline.string.dataBefore
		 * @default 'data-before' */
		dataBefore: 'data-before'
		/** @constant totaltimeline.string.dataAfter
		 * @default 'data-after' */
		,dataAfter: 'data-after'
		,mouseover: 'mouseover'
		,mouseout: 'mouseout'
		,mousemove: 'mousemove'
		,mousedown: 'mousedown'
		,mouseup: 'mouseup'
		,touchstart: 'touchstart'
		,touchmove: 'touchmove'
		,touchend: 'touchend'
		,selected: 'selected'
		,drag: 'drag'
		,click: 'click'
		,getPercentage: getPercentage
	};
})());