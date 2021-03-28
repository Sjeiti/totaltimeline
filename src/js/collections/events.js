import {collection} from './collection'
import {event} from './event'
import {moment, SINCE, YEAR} from '../time/moment'
import {eventInfo} from '../time/eventInfo'
import {getPercentage} from '../util'

/**
 * Events collections
 * @type collectionInstance
 * @name events
 */
export const events = collection(
  'events'
  ,'events.json'
  ,function(data){
    data.forEach((entry,index)=> {

      const ago = parseInt(entry.ago,10)
      const since = parseInt(entry.since,10)
      const year = parseInt(entry.year,10)

      const entryMoment = ago?moment(ago):(since?moment(since,SINCE):year&&moment(year,YEAR))
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
