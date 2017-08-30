import collection from './collection'
import event from './event'
import moment from '../time/moment'
import eventInfo from '../time/eventInfo'
import {getPercentage} from '../util'

/**
 * Events collections
 * @type collectionInstance
 * @name events
 */
export default collection(
  'events'
  ,'events'
  ,function(data){
    //ago, since, year, name, example, exclude, importance, explanation, link, accuracy, remark
    data.forEach(function(entry){
      //console.log('event',getProp(entry,'name'),getProp(entry,'ago'),getProp(entry,'ago',true)); // log
      const ago = parseInt(entry.ago,10)
        ,since = parseInt(entry.since,10)
        ,year = parseInt(entry.year,10)
        ,entryMoment = ago?moment(ago):(since?moment(since,moment.SINCE):year&&moment(year,moment.YEAR))
        ,isExcluded = entry.exclude==='1'
      if (entryMoment&&!isExcluded) {
        this.push(event(
          entryMoment
          ,eventInfo().parse(entry)
        ))
      }
    }.bind(this))
    // sort events by ago
    this.sort(function(eventA, eventB){
      return eventA.moment.ago>eventB.moment.ago?-1:1
    })
    this.dataLoaded.dispatch(this)
  }
  ,function(fragment,range){
    const rangeStart = range.start.ago
      ,rangeEnd = range.end.ago
      ,duration = range.duration
    this.forEach(event=>{
      const ago = event.moment.ago
        ,isInside = ago<=rangeStart&&ago>=rangeEnd
      if (isInside) {
        const element = event.element
          ,fRel = 1-((ago-rangeEnd)/duration)
        element.style.left = getPercentage(fRel)
        fragment.appendChild(element)
      }
      event.inside(isInside)
    })
  }
)
