import {collection} from './collection'
import {moment} from '../time/moment'
import {range} from '../time/range'
import {eventInfo} from '../time/eventInfo'
import {period} from './period'
import {getPercentage} from '../util'

/**
 * Periods collections
 * @type collectionInstance
 * @name periods
 */
collection(
  'periods'
  ,'eras.json'
  ,function(data){
    const timeNames = 'supereon,eon,era,period,epoch,age'.split(',')
    const timeNum = timeNames.length
    data.forEach((entry)=> {
      const from = parseFloat(entry.from)
      const to = parseFloat(entry.to)
      const name = entry.name

      if (from!==undefined&&to!==undefined&&name!==undefined) {
        let offset = 0
        for (let i=0;i<timeNum;i++) {
          const timeName = timeNames[i]
          const timeValue = entry[timeName]//getProp(entry,sTimeName)

          if (timeValue!=='') {
            offset = i
            break
          }
        }
        this.push(period(
          range(moment(from),moment(to))
          ,eventInfo().parse(entry)
          ,offset
        ))
      }
    })
    this.dataLoaded.dispatch(this)
  }
  ,function(range){
    const rangeEnd = range.end.ago
    const duration = range.duration
    const show = []
    this.forEach((period)=> {
      if (period.coincides(range)) {
        const periodElement = period.element
        const ago = period.range.start.ago
        let relLeft = 1-((ago-rangeEnd)/duration)
        let relWidth = period.range.duration/duration

        if (relLeft<0) {
          relWidth += relLeft
          relLeft = 0
        }
        if ((relLeft+relWidth)>1) {
          relWidth = 1 - relLeft
        }
        periodElement.style.left = getPercentage(relLeft)
        periodElement.style.width = getPercentage(relWidth)
        show.push(periodElement)
      }
    })
    this._populateElements(show)
  }
)
