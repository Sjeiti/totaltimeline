import createSignal from './'

/**
 * Signal for mouseWheel.<br/>
 * The callback for this signal is Function(wheelDelta)
 * @name iddqd.signal.mouseWheel
 * @type Signal
 */
export default createSignal(function(signal){
	window.addEventListener('DOMMouseScroll',function(e){
		signal.dispatch(10*e.detail,e);
	},false);
	window.addEventListener('mousewheel',function(e){
		signal.dispatch(e.wheelDelta,e);
	},false);
})