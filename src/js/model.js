import Signal from 'signals'
import {UNIVERSE, NOW} from './time'
import {moment} from './time/moment'
import {range} from './time/range'
import {getCssValuePrefix} from './util'


export const span = range(moment(UNIVERSE),moment(NOW))
export const currentRange = range(moment(UNIVERSE),moment(NOW),moment(UNIVERSE))
export const entryShown = new Signal()
export const editEvent = new Signal()
export const cssPrefix = getCssValuePrefix()
export const userAgent = {
  isPhantom: navigator.userAgent.match(/PhantomJS/)
}
export const api = {exists:false}


