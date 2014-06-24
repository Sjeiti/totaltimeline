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
			toString: function(){return '[object range, '+start.toString()+' - '+end.toString()+']';}
			,start: start
			,end: end
			,duration: start.ago-end.ago
			,change: change
			,moveStart: moveStart

			,inside: inside
			,surrounds: surrounds
			,coincides: coincides

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

	return oReturn;
});