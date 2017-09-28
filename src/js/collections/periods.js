import collection from './collection'
import moment from '../time/moment'
import range from '../time/range'
import eventInfo from '../time/eventInfo'
import period from './period'
import {getPercentage} from '../util'

/**
 * Periods collections
 * @type collectionInstance
 * @name periods
 */
export default collection(
  'periods'
  ,'eras.json'
  ,function(data){
    const aTimes = 'supereon,eon,era,period,epoch,age'.split(',')
      ,iTimes = aTimes.length
    data.forEach(function(entry){
      const iFrom = parseInt(entry.from,10)
        ,iTo = parseInt(entry.to,10)
        ,sName = entry.name

      if (iFrom!==undefined&&iTo!==undefined&&sName!==undefined) {
        let iOffset = 0
        for (let i=0;i<iTimes;i++) {
          const sTimeName = aTimes[i]
            ,sTimeValue = entry[sTimeName]//getProp(entry,sTimeName)

          if (sTimeValue!=='') {
            iOffset = i
            break
          }
        }
        this.push(period(
          range(moment(iFrom),moment(iTo))
          ,eventInfo().parse(entry)
          ,iOffset
        ))
      }
    }.bind(this))
    this.dataLoaded.dispatch(this)
  }
  ,function(range){
    const iRangeEnd = range.end.ago
      ,iDuration = range.duration
      ,show = []
    this.forEach(function(period){
      if (period.coincides(range)) {
        const mPeriod = period.element
          ,iAgo = period.range.start.ago
        let fRelLeft = 1-((iAgo-iRangeEnd)/iDuration)
          ,fRelWidth = period.range.duration/iDuration

        if (fRelLeft<0) {
          fRelWidth += fRelLeft
          fRelLeft = 0
        }
        if ((fRelLeft+fRelWidth)>1) {
          fRelWidth = 1 - fRelLeft
        }
        mPeriod.style.left = getPercentage(fRelLeft)
        mPeriod.style.width = getPercentage(fRelWidth)
        show.push(mPeriod)
      }
    })
    this._populateElements(show)
  }
)
