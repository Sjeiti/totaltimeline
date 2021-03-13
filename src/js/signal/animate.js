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
  let fDeltaT = 0
		 let iCurMillis
		 let iLastMillis = Date.now()
		 let iMilliLen = 10
		 let aMillis = (function(a,n){
    for (let i=0;i<iMilliLen;i++) a.push(n)
    return a
  })([],iLastMillis)
		 let iFrameNr = 0
  function animate(){
    iCurMillis = Date.now()
    aMillis.push(iCurMillis-iLastMillis)
    aMillis.shift()
    fDeltaT = 0
    for (let i=0;i<iMilliLen;i++) fDeltaT += aMillis[i]
    iLastMillis = iCurMillis
    signal.dispatch(fDeltaT/iMilliLen,iCurMillis,iFrameNr)
    requestAnimationFrame(animate)
  }
  animate()
})