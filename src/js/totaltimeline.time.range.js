//todo: typedef range
/**
 * An object instance created by the factory method {@link totaltimeline.time.range}
 * @typedef {object} range
 * @property {function} set
 * @property {moment} start
 * @property {moment} end
 * @property {moment} min
 * @property {moment} max
 * @property {number} duration
 * @property {Signal} change
 * @property {function} moveStart
 * @property {function} coincides
 * @property {function} clone
 * @property {function} factory Direct link back to the original factory
 */
/**
 * The timerange between two moments.
 * @name totaltimeline.time.range
 * @method
 * @param {moment} start
 * @param {moment} end
 * @param {moment} min
 * @param {moment} max
 * @returns {range}
 */
iddqd.ns('totaltimeline.time.range',function range(start,end,min,max){
	'use strict';
	var time = totaltimeline.time
		,moment = time.moment
		,change = new signals.Signal()
		,oReturn = iddqd.factory(range,{
			toString: function(){return '[object range, '+start.toString()+' - '+end.toString()+']';}

			,set: set
			,animate: animate

			,start: start
			,end: end

			,min: min
			,max: max

			,duration: start.ago-end.ago
			,change: change
			,moveStart: moveStart

			,coincides: coincides

			,clone: clone
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
		change.dispatch(oReturn);
	}

	/**
	 * Set both start and end time.
	 * Method can be overloaded by either using only a range as the first parameter, or a number for both parameters.
	 * @param {number|range} startAgo
	 * @param {number} endAgo
	 */
	function set(startAgo,endAgo){
		if (arguments.length===1) { // assume range
			endAgo = startAgo.end.ago;
			startAgo = startAgo.start.ago;
		}
		start.set(startAgo,false);
		end.set(endAgo);
		if (min&&start.ago>min.ago) {
			// todo: implement without moveStart and only calling start.set and end.set once
			moveStart(min.ago);
		}
		// todo: implement max
	}

	// todo: document // no overload!
	function animate(startAgo,endAgo,callback){
		/*if (arguments.length===1) { // assume range
			endAgo = startAgo.end.ago;
			startAgo = startAgo.start.ago;
		}*/
		var iStartFrom = start.ago
			,iStartDelta = startAgo - iStartFrom
			,iEndFrom = end.ago
			,iEndDelta = endAgo - iEndFrom;
		iddqd.animate(1000,function(f){
			var fInOut = TWEEN.Easing.Quadratic.InOut(f);
			set(iStartFrom+fInOut*iStartDelta,iEndFrom+fInOut*iEndDelta);
		},callback);
	}

	/**
	 * Moves the range by setting the start moment. End moment is recalculated.
	 * @param {number} ago
	 * @fires Change signal.
	 */
	function moveStart(ago) {
		if (min&&ago>min.ago) {
			end.ago += ago-min.ago;
			ago = min.ago;
		}
		// todo: implement max
		start.set(ago,false);
		end.set(ago-oReturn.duration,false);
		change.dispatch(oReturn);
	}

	/**
	 *
	 * @param {moment|range} time
	 * @returns {boolean}
	 */
	function coincides(time){
		var bCoincides = false;
		if (time.factory===moment) {
			bCoincides = momentInside(time);
		} else {
			var iStart = start.ago
				,iEnd = end.ago
				,iRStart = time.start.ago
				,iREnd = time.end.ago;
			bCoincides = momentInside(time.start)
				||momentInside(time.end)
				||iStart<=iRStart&&iEnd>=iREnd
				||iStart>=iRStart&&iEnd<=iREnd
			;
		}
		return bCoincides;
	}

	// todo: document
	function momentInside(moment){
		return moment.ago<=start.ago&&moment.ago>=end.ago;
	}

	// todo: document
	function clone() {
		return range(start.clone(),end.clone());
	}

	return oReturn;
});