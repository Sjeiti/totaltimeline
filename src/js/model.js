import Signal from 'signals'
import time from './time'
import moment from './time/moment'
import range from './time/range'
import util from './util'

//collection.forEach(function(col=>col.getData())
//pages.getData(model)

/**
 * @name model
 */
export default {
  span: range(moment(time.UNIVERSE),moment(time.NOW))
  ,range: range(moment(time.UNIVERSE),moment(time.NOW),moment(time.UNIVERSE))
  ,spreadsheetKey: '1wn2bs7T2ZzajyhaQYmJvth3u2ikZv10ZUEpvIB9iXhM'
  ,entryShown: new Signal()
  ,foo: new Signal()
  ,cssPrefix: util.getCssValuePrefix()
  ,userAgent: {
    isPhantom: navigator.userAgent.match(/PhantomJS/)
  }
}
