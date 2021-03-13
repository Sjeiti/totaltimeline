/**
 * Created by micro on 8/12/2017.
 */
/**
 * @namespace totaltimeline.touch
 */
export default function touch(element, moveCallback, startCallback){

  const touchXLast = []

  element.addEventListener('touchstart',handleTouchStart,false)
  element.addEventListener('touchmove',handleTouchMove,false)

  /**
	 * Handles touchstart event to scroll or zoom the timeline.
	 */
  function handleTouchStart(e) {
    touchXLast.length = 0
    startCallback&&startCallback(e)
  }

  /**
	 * Handles touchmove event to scroll or zoom the timeline.
	 * @param {Event} e
	 */
  function handleTouchMove(e) {
    var touches = e.touches
			 var numTouches = touches.length
			 var touchesPageX = []
			 var touchXLastLength = touchXLast.length

    for (var i=0;i<numTouches;i++) {
      touchesPageX.push(touches[i].pageX)
    }
    // sort if length===2: old fashioned swap is way faster than sort: http://jsperf.com/array-length-2-sort
    if (numTouches===2&&touchesPageX[0]>touchesPageX[1]) {
      var tmp = touchesPageX[0]
      touchesPageX[0] = touchesPageX[1]
      touchesPageX[1] = tmp
    }
    moveCallback&&moveCallback(e,numTouches,touchesPageX,touchXLastLength,touchXLast)
  }
}