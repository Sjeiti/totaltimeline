/**
 * @name range
 * @namespace totaltimeline.time
 * @param {moment} start
 * @param {moment} end
 */
iddqd.ns('totaltimeline.time.range',function(start,end){
	'use strict';
	var change = new signals.Signal()
		,oReturn = {
			start: start
			,end: end
			,duration: start.ago-end.ago
			,change: change
			,moveStart: moveStart
		}
	;
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

	return oReturn;
});