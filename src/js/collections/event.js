/**
 * Factory module to create events
 * @module event
 */
// import {random} from '../math/prng'
// import animate from '../animate'
import model from '../model'
import {getPercentage,getFragment} from '../util'

const proto = {
  toString(){return '[event \''+this.info.name+'\', '+this.moment.value+' '+this.moment.type+']'}
  ,inside(is){
    if (!is&&this.element.classList.contains('selected')) {
      model.entryShown.dispatch()
    }
  }
  ///////////////////////////////////////
  ,animate(startAgo,endAgo,callback){
    console.log('event.animate',arguments); // todo: remove log
    // const iStartFrom = this.start.ago
    //   ,iStartDelta = startAgo - iStartFrom
    //   ,iEndFrom = this.end.ago
    //   ,iEndDelta = endAgo - iEndFrom
    // animate(1000,f=>{
    //   const fInOut = animate.quadratic.inOut(f)
    //   this.set(iStartFrom+fInOut*iStartDelta,iEndFrom+fInOut*iEndDelta)
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
 * @param {object} data
 * @returns {event}
 */
export default function event(moment,info,index,entry){
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
    ,mWrap = event.element
    ,mEvent = mWrap.querySelector('.event')
    ,mTitle = mWrap.querySelector('h3')
    ,mTime = mWrap.querySelector('time')
    //
    ,top = 0.15 + 0.7*((index * (137.5/360))%1)
    ,sTop = getPercentage(top)
    ,sHeight = getPercentage(1-top)
    //

  mEvent.model = event
  mEvent.style.top = sTop
  info.icon!==''&&mEvent.classList.add('icon-'+info.icon)

  mTitle.style.top = sTop

  mTime.style.height = sHeight // todo: less vars @eventIconSize
  mTime.setAttribute('data-after',moment.toString()) // todo: better as textContent

  model.entryShown.add(onEntryShown)

  /**
   * Handles entryShown signal
   * @param {period|event} entry
   */
  function onEntryShown(entry){
    mWrap.classList.toggle('selected',entry&&entry.info===info||false)
  }

  return event
}
