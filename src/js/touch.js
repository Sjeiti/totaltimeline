/**
 * Created by micro on 8/12/2017.
 */
/**
 * @namespace totaltimeline.touch
 */
export default function touch(element, moveCallback, startCallback){

  const aTouchXLast = []

  element.addEventListener('touchstart',handleTouchStart,false)
  element.addEventListener('touchmove',handleTouchMove,false)

  /**
	 * Handles touchstart event to scroll or zoom the timeline.
	 */
  function handleTouchStart(e) {
    aTouchXLast.length = 0
    startCallback&&startCallback(e)
  }

  /**
	 * Handles touchmove event to scroll or zoom the timeline.
	 * @param {Event} e
	 */
  function handleTouchMove(e) {
    var touches = e.touches
			 var iX = touches.length
			 var aTouchX = []
			 var iXLast = aTouchXLast.length
		
    for (var i=0;i<iX;i++) {
      aTouchX.push(touches[i].pageX)
    }
    // sort if length===2: old fashioned swap is way faster than sort: http://jsperf.com/array-length-2-sort
    if (iX===2&&aTouchX[0]>aTouchX[1]) {
      var tmp = aTouchX[0]
      aTouchX[0] = aTouchX[1]
      aTouchX[1] = tmp
    }
    moveCallback&&moveCallback(e,iX,aTouchX,iXLast,aTouchXLast)
  }
}