import createSignal from './'

/**
 * Keyframe dispatcher using requestAnimationFrame for continuous animation.
 * The callback for this signal is Function(deltaT,iCurMillis,iFrameNr)
 * @name iddqd.signal.animate
 * @type Signal
 * @requires iddqd.requestAnimationFrame
 * @todo: possibly stop when last signal listener is removed
 */
export default createSignal(function(signal){
  let deltaT = 0
		 let millisCurrent
		 let millisLast = Date.now()
		 const millisLength = 10
		 const millisList = (function(a,n){
    for (let i=0;i<millisLength;i++) a.push(n)
    return a
  })([],millisLast)
		 const frameNumber = 0
  function animate(){
    millisCurrent = Date.now()
    millisList.push(millisCurrent-millisLast)
    millisList.shift()
    deltaT = 0
    for (let i=0;i<millisLength;i++) deltaT += millisList[i]
    millisLast = millisCurrent
    signal.dispatch(deltaT/millisLength,millisCurrent,frameNumber)
    requestAnimationFrame(animate)
  }
  animate()
})