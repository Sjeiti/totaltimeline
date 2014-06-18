/**
 * @name range
 * @namespace totaltimeline.time
 * @param start {moment}
 * @param end {moment}
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
	function handleChange(){
		oReturn.duration = start.ago-end.ago;
		change.dispatch();
	}
	function moveStart(ago) {
//		console.log('ago',ago); // log
		start.set(ago,false);
		end.set(ago-oReturn.duration,false);
		change.dispatch();
	}
	return oReturn;
});