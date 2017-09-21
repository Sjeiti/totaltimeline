import Signal from 'signals'
import time from './time'
import moment from './time/moment'
import range from './time/range'
import util from './util'

/**
 * @name model
 */
export default {
  span: range(moment(time.UNIVERSE),moment(time.NOW))
  ,range: range(moment(time.UNIVERSE),moment(time.NOW),moment(time.UNIVERSE))
  ,entryShown: new Signal()
  ,cssPrefix: util.getCssValuePrefix()
  ,userAgent: {
    isPhantom: navigator.userAgent.match(/PhantomJS/)
  }
}
