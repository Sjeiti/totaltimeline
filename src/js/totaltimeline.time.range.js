//todo: typedef range
/**
 * An object instance created by the factory method {@link totaltimeline.time.range}
 * @typedef {object} range
 * @property {function} set
 * @property {moment} start
 * @property {moment} end
 * @property {number} duration
 * @property {Signal} change
 * @property {function} moveStart
 * @property {function} inside
 * @property {function} surrounds
 * @property {function} coincides
 * @property {function} proto
 */
/**
 * The timerange between two moments.
 * @name totaltimeline.time.range
 * @method
 * @param {moment} start
 * @param {moment} end
 * @returns {range}
 */
iddqd.ns('totaltimeline.time.range',function range(start,end){
	'use strict';
	var time = totaltimeline.time
		,period = time.period // todo: period should be view element, remove here
		,moment = time.moment
		,change = new signals.Signal()
		,oReturn = iddqd.factory(range,{
			toString: function(){return '[object range, '+start.toString()+' - '+end.toString()+']';}

			,set: set
			,start: start
			,end: end

			,duration: start.ago-end.ago
			,change: change
			,moveStart: moveStart

			,inside: inside
			,surrounds: surrounds
			,coincides: coincides

			,clone: clone

			,proto: range
		})
	;
	// todo: check if start > end
	start.change.add(handleChange);
	end.change.add(handleChange);

	/**
	 * Handles change in either start- or end moment by recalculating duration.
	 * @fires Change signal.
	 */
	function handleChange(){
		oReturn.duration = start.ago-end.ago;
		change.dispatch();
	}

	/**
	 * Set both start and end time.
	 * Method can be overloaded by either using only a range as the first parameter, or a number for both parameters.
	 * {number|range} startAgo
	 * {number} endAgo
	 */
	function set(startAgo,endAgo){
		if (arguments.length===1) { // assume range
			start.set(startAgo.start.ago,false);
			end.set(startAgo.end.ago);
		} else {
			start.set(startAgo,false);
			end.set(endAgo);
		}
	}

	/**
	 * Moves the range by setting the start moment. End moment is recalculated.
	 * @param {number} ago
	 * @fires Change signal.
	 */
	function moveStart(ago) {
		start.set(ago,false);
		end.set(ago-oReturn.duration,false);
		change.dispatch();
	}

	function inside(time) { // todo: rem
		var oStartEnd = getInsideStartEnd(time);
		return !oStartEnd.start&&!oStartEnd.end;
	}

	function surrounds(time) {
		var oStartEnd = getInsideStartEnd(time);
		return oStartEnd.start&&oStartEnd.end;
	}

	function coincides(time){
		var bCoincides = false;
		if (time.factory===moment) {
			bCoincides = momentInside(time);
		} else {
			var oRange = time.factory===period?time.range:time
				,iStart = start.ago
				,iEnd = end.ago
				,iRStart = oRange.start.ago
				,iREnd = oRange.end.ago;
			bCoincides = momentInside(oRange.start)
				||momentInside(oRange.end)
				||iStart<=iRStart&&iEnd>=iREnd
				||iStart>=iRStart&&iEnd<=iREnd
			;
		}
		return bCoincides;
	}

	function getInsideStartEnd(time){ // todo: check or rem
		var oRange, bStart, bEnd;
		if (time.factory===moment) {
			bStart = bEnd = momentInside(time);
		} else {
			oRange = time.factory===period?time.range:time;
			bStart = momentInside(oRange.start);
			bEnd = momentInside(oRange.end);
		}
		return {start:bStart,end:bEnd};
	}

	function momentInside(moment){
		window.foo&&console.log('momentInside',start.ago,end.ago,':',moment.ago,moment.ago<=start.ago&&moment.ago>=end.ago); // log
		return moment.ago<=start.ago&&moment.ago>=end.ago;
	}
	
	function clone() {
		return range(start.clone(),end.clone());
	}

	return oReturn;
});