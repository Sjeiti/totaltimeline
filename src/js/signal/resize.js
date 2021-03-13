import createSignal from './'

/**
 * Dispatched when the viewport resizes.<br/>
 * The callback for this signal is Function(newWidth,newHeight,oldWidth,oldHeight)
 * @name resize
 * @type Signal
 */
export default createSignal(function(signal){
  const win = window
  const doc = document
		 const docElm = doc.documentElement
		 const body = doc.body
  let w = win.innerWidth || docElm.clientWidth || body.clientWidth
		 let h = win.innerHeight|| docElm.clientHeight|| body.clientHeight
  win.addEventListener('resize', function(docElm){
    const oldW = w
			 const oldH = h
    w = win.innerWidth || docElm.clientWidth || body.clientWidth
    h = win.innerHeight|| docElm.clientHeight|| body.clientHeight
    signal.dispatch(w,h,oldW,oldH)
  },false)
})