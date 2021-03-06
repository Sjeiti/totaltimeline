import {createSignal} from './'
import {animate} from './animate'

/**
 * Wrapper namespace for keyboard signals.<br/>
 * Is really an Array containing pressed keycodes.
 * @name key
 * @summary Wrapper namespace for keyboard signals.
 */
const fn = ()=>{}
let lastKeyDownEvent
let isInitialised = false
/**
   * Signal for keyPress.<br/>
   * The callback for this signal is Function(keys,event)
   * @name keypress
   * @type Signal
   */
const press = createSignal(init)
/**
   * Signal for keyDown.<br/>
   * The callback for this signal is Function(keyCode,keys,event)
   * @name keydown
   * @type Signal
   */
const down = createSignal(initDown)
/**
   * Signal for keyUp.<br/>
   * The callback for this signal is Function(keyCode,keys,event)
   * @name keyup
   * @type Signal
   */
const up = createSignal(initUp)
//
export const key = Object.assign([],{
  press: press
  ,down: down
  ,up: up
})

function init(){
  if (!isInitialised) {
    isInitialised = true
    press.add(fn).detach()
    down.add(fn).detach()
    up.add(fn).detach()
  }
}
function initDown(signal){
  init()
  document.addEventListener('keydown',(e)=> {
    const keyCode = e.keyCode
    key[keyCode] = true
    lastKeyDownEvent = e
    signal.dispatch(keyCode,key,e)
    animate.add(keypress)
  })
}
function initUp(signal){
  init()
  document.addEventListener('keyup',(e)=> {
    const iKeyCode = e.keyCode
    key[iKeyCode] = false
    animate.remove(keypress)
    signal.dispatch(iKeyCode,key,e)
  })
}
function keypress(){
  press.dispatch(key,lastKeyDownEvent)
}