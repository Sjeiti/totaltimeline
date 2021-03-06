import {createSignal} from './'

/**
 * Signal for mouseWheel.<br/>
 * The callback for this signal is Function(wheelDelta)
 * @name iddqd.signal.mouseWheel
 * @type Signal
 */
export const mouseWheel = createSignal((signal)=> {
  window.addEventListener('DOMMouseScroll',(e)=> {
    signal.dispatch(10*e.detail,e)
  },false)
  window.addEventListener('mousewheel',(e)=> {
    signal.dispatch(e.wheelDelta,e)
  },false)
})