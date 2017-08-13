import collection from './'
import model from '../model'
import moment from '../time/moment'
import range from '../time/range'
import eventInfo from '../time/eventInfo'
import period from './period'
import {getData} from '../spreadsheetProxy'
import {getPercentage} from '../util'

/**
 * Periods collection
 * @type collectionInstance
 * @name periods
 */
const periods = collection.add(
    'periods'
    ,2
    ,handleGetData
    ,populate
  )

const worksheet = 2//'periods'
getData(model.spreadsheetKey,worksheet,handleGetData)


// todo: document
function handleGetData(data){
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
      periods.push(period(
        range(moment(iFrom),moment(iTo))
        ,eventInfo().parse(entry)
        ,iOffset
      ))
    }
  })
  periods.dataLoaded.dispatch(periods)
}

// todo: document
function populate(fragment,range){
  const iRangeEnd = range.end.ago
    ,iDuration = range.duration

  periods.forEach(function(period){
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
      fragment.appendChild(mPeriod)
    }
  })
}

export default periods