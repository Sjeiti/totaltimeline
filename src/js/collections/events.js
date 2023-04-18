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

      // parseInt fails for exponential values, ie 2E4 becomes 2
      const ago = parseFloat(entry.ago)
      const since = parseFloat(entry.since)
      const year = parseFloat(entry.year)

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
    // const durationImportance = duration/13798000000
    // const durationImportance = duration/13798000000**1E-1
    // const durationImportance = 1-(1-duration/13798000000)**1E5
    // const durationImportance = 1-((1-duration/13798000000)**1E5)
    // const durationImportance = 1-((1-duration/13798000000)**3E6)
    const durationImportance = 1E-2*duration
    // console.log('durationImportance',durationImportance) // todo: remove log
    // console.log('durationImportance',duration/13798000000,durationImportance) // todo: remove log
    const show = []
    this.forEach(event=>{
      const {moment, element, info: {importance=1}} = event
      const ago = moment.ago
      const isInside = ago<=rangeStart&&ago>=rangeEnd

      // event.info.name==='bees'&&console.log('bees', event) // todo: remove log

      if (isInside) {
        // todo event scale vs duration scale
        const isImportant = importance===''||importance>durationImportance
        const {selected} = event

        // console.log('event.importance', importance, duration/13798000000, duration) // todo: remove log
        // console.log('event',event) // todo: remove log
        //
        if (isImportant||selected) {
          // event.index===111&&console.log('event',{event},durationImportance) // todo: remove log
          const relative = 1-((ago-rangeEnd)/duration)
          element.style.left = getPercentage(relative)
          show.push(element)
        }
      }
      event.inside(isInside)
    })
    this._populateElements(show)
  }
)
