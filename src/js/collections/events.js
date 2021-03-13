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
  ,'events.json'
  ,function(data){
    //ago, since, year, name, example, exclude, importance, explanation, link, accuracy, remark
    data.forEach((entry,index)=> {
      //console.log('event',getProp(entry,'name'),getProp(entry,'ago'),getProp(entry,'ago',true)); // log
      const ago = parseInt(entry.ago,10)
      const since = parseInt(entry.since,10)
      const year = parseInt(entry.year,10)
      const entryMoment = ago?moment(ago):(since?moment(since,moment.SINCE):year&&moment(year,moment.YEAR))
      const isExcluded = entry.exclude==='1'
      if (entryMoment&&!isExcluded) {
        this.push(event(
          entryMoment
          ,eventInfo().parse(entry)
          ,index
          ,entry
        ))
      }
    })
    // sort events by ago
    this.sort((eventA, eventB)=> {
      return eventA.moment.ago>eventB.moment.ago?-1:1
    })
    this.dataLoaded.dispatch(this)
  }
  ,function(range){
    const rangeStart = range.start.ago
    const rangeEnd = range.end.ago
    const duration = range.duration
    const show = []
    this.forEach(event=>{
      const ago = event.moment.ago
      const isInside = ago<=rangeStart&&ago>=rangeEnd
      if (isInside) {
        const element = event.element
        const relative = 1-((ago-rangeEnd)/duration)
        element.style.left = getPercentage(relative)
        show.push(element)
      }
      event.inside(isInside)
    })
    this._populateElements(show)
  }
)
