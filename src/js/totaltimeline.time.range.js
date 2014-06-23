/**
 * @name range
 * @namespace totaltimeline.time
 * @param {moment} start
 * @param {moment} end
 */
iddqd.ns('totaltimeline.time.range',function range(start,end){
	'use strict';
	var time = totaltimeline.time
		,period = time.period
		,moment = time.moment
		,change = new signals.Signal()
		,oReturn = iddqd.factory(range,{
			start: start
			,end: end
			,duration: start.ago-end.ago
			,change: change
			,moveStart: moveStart
			,inside: inside
			,surrounds: surrounds
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
	 * Moves the range by setting the start moment. End moment is recalculated.
	 * @param {number} ago
	 * @fires Change signal.
	 */
	function moveStart(ago) {
		start.set(ago,false);
		end.set(ago-oReturn.duration,false);
		change.dispatch();
	}

	function inside(rangeOrMoment) {
		if (rangeOrMoment.hasOwnProperty('range')) rangeOrMoment = rangeOrMoment.range;
		var bStart = start.ago<=rangeOrMoment.start.ago
			,bEnd = end.ago>=rangeOrMoment.end.ago
		;
		return bStart&&bEnd;
	}

	function surrounds(time) {
		var oRange = time.factory===period?time.range:time
			,bMoment = oRange.factory===moment
			,iStart = bMoment?oRange.ago:oRange.start.ago
			,iEnd = bMoment?iStart:oRange.end.ago
		;
		var bStart = start.ago>=iStart
			,bEnd = end.ago<=iEnd
		;
		return bStart&&bEnd;
	}

	return oReturn;
});