/**
 * Factory module to create events
 * @module event
 */
// import {random} from '../math/prng'
// import {animate} from '../animate'
import {entryShown} from '../model'
import {getPercentage,getFragment} from '../util'

const proto = {
  toString(){return '[event \''+this.info.name+'\', '+this.moment.value+' '+this.moment.type+']'}
  ,inside(is){
    if (!is&&this.element.classList.contains('selected')) {
      entryShown.dispatch()
    }
  }
  ///////////////////////////////////////
  ,animate(/*startAgo, endAgo, callback*/){
    console.log('event.animate',arguments) // todo: remove log
    // const startFrom = this.start.ago
    // const startDelta = startAgo - startFrom
    // const endFrom = this.end.ago
    // const endDelta = endAgo - endFrom
    // animate(1000,f=>{
    //   const inOut = animate.quadratic.inOut(f)
    //   this.set(startFrom+inOut*startDelta,endFrom+inOut*endDelta)
    // },callback)
  }
  ///////////////////////////////////////
}

/**
 * An event on the timeline
 * @typedef {object} event
 * @property {HTMLElement} element
 * @property {eventInfo} info
 * @property {moment} moment
 */

/**
 * @name event
 * @param {moment} moment
 * @param {eventInfo} info
 * @param {number} index
 * @param {object} entry
 * @returns {event}
 */
export function event(moment, info, index, entry){
  const event = Object.create(proto,{
    moment: {value:moment}
    ,info: {value:info}
    ,element: {value:getFragment(`<div class="event-wrap">
  <time></time>
  <div class="event"></div>
  <h3><a href="${info.slug}">${info.name}</a></h3>
</div>`).firstChild}
    ,index: {value:index}
    ,entry: {value:entry}
  })
  const wrapper = event.element
  const eventElement = wrapper.querySelector('.event')
  const titleElement = wrapper.querySelector('h3')
  const timeElement = wrapper.querySelector('time')

  const top = 0.15 + 0.7*((index * (137.5/360))%1)
  const topPercent = getPercentage(top)
  const heightPercent = getPercentage(1-top)

  eventElement.model = event
  eventElement.style.top = topPercent
  info.icon!==''&&eventElement.classList.add('icon-'+info.icon)

  titleElement.style.top = topPercent

  timeElement.style.height = heightPercent // todo: less vars @eventIconSize
  timeElement.setAttribute('data-after',moment.toString()) // todo: better as textContent

  entryShown.add(onEntryShown)

  /**
   * Handles entryShown signal
   * @param {period|event} entry
   */
  function onEntryShown(entry){
    wrapper.classList.toggle('selected',entry&&entry.info===info||false)
  }

  return event
}
