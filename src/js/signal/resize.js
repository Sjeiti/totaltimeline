import createSignal from './'

/**
 * Dispatched when the viewport resizes.<br/>
 * The callback for this signal is Function(newWidth,newHeight,oldWidth,oldHeight)
 * @name resize
 * @type Signal
 */
export default createSignal(function(signal){
	const win = window
    ,doc = document
		,docElm = doc.documentElement
		,mBody = doc.body
	let iW = win.innerWidth || docElm.clientWidth || mBody.clientWidth
		,iH = win.innerHeight|| docElm.clientHeight|| mBody.clientHeight
	win.addEventListener('resize', function(docElm){
		const iOldW = iW
			,iOldH = iH
		iW = win.innerWidth || docElm.clientWidth || mBody.clientWidth
		iH = win.innerHeight|| docElm.clientHeight|| mBody.clientHeight
		signal.dispatch(iW,iH,iOldW,iOldH)
	},false)
})