/**
 * Dispatched when the readyState changes (mainly for finding state=='interactive', otherwise iddqd.signals.DOMReady suffices).<br/>
 * The callback for this signal is Function(readyState)
 * @name readyState
 * @type Signal
 */
import Signal from 'signals'

const readyState = new Signal()
document.addEventListener(
  'readystatechange'
  ,()=>readyState.dispatch(document.readyState)
)

export default readyState
