import createSignal from './'
import animate from './animate'

/**
 * Wrapper namespace for keyboard signals.<br/>
 * Is really an Array containing pressed keycodes.
 * @name key
 * @summary Wrapper namespace for keyboard signals.
 */
var fn = ()=>{}
var eLastKeyDown
var bInit = false
/**
   * Signal for keyPress.<br/>
   * The callback for this signal is Function(keys,event)
   * @name keypress
   * @type Signal
   */
var press = createSignal(init)
/**
   * Signal for keyDown.<br/>
   * The callback for this signal is Function(keyCode,keys,event)
   * @name keydown
   * @type Signal
   */
var down = createSignal(initDown)
/**
   * Signal for keyUp.<br/>
   * The callback for this signal is Function(keyCode,keys,event)
   * @name keyup
   * @type Signal
   */
var up = createSignal(initUp)
//
var key = Object.assign([],{
  press: press
  ,down: down
  ,up: up
})

function init(){
  if (!bInit) {
    bInit = true
    press.add(fn).detach()
    down.add(fn).detach()
    up.add(fn).detach()
  }
}
function initDown(signal){
  init()
  document.addEventListener('keydown',function(e){
    const iKeyCode = e.keyCode
    key[iKeyCode] = true
    eLastKeyDown = e
    signal.dispatch(iKeyCode,key,e)
    animate.add(keypress)
  })
}
function initUp(signal){
  init()
  document.addEventListener('keyup',function(e){
    const iKeyCode = e.keyCode
    key[iKeyCode] = false
    animate.remove(keypress)
    signal.dispatch(iKeyCode,key,e)
  })
}
function keypress(){
  press.dispatch(key,eLastKeyDown)
}

export default key