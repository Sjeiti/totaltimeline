import {random} from '../math/prng'
import animate from '../animate'
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
 * @name event
 * @param {moment} moment
 * @param {eventInfo} info
 */
export default function event(moment,info){
  var event = Object.create(proto,{
      moment: {value:moment}
      ,info: {value:info}
      ,element: {value:getFragment(`<div class="event-wrap">
  <time></time>
  <div class="event"></div>
  <h3><a href="${info.slug}">${info.name}</a></h3>
</div>`).firstChild}
    })
    ,mWrap = event.element
    ,mEvent = mWrap.querySelector('.event')
    ,mTitle = mWrap.querySelector('h3')
    ,mTime = mWrap.querySelector('time')
    //
    ,iName = info.name.split('').map(s=>s.charCodeAt()).reduce((a,b)=>a+b,0)
    ,iSeed = iName*143E4 + Math.abs(moment.value<2E4?1E4*moment.value:moment.value)
    ,fTop = 0.5 + 0.6*(random(iSeed)-0.5)
    ,sTop = getPercentage(fTop)
    ,sHeight = getPercentage(1-fTop)
    //

  mEvent.model = event
  mEvent.style.top = sTop
  info.icon!==''&&mEvent.classList.add('icon-'+info.icon)

  mTitle.style.top = sTop

  mTime.style.height = sHeight // todo: less vars @eventIconSize
  mTime.setAttribute('data-after',moment.toString()) // todo: better as textContent

  model.entryShown.add(handleEntryShown)

  /**
   * Handles entryShown signal
   * @param {period|event} entry
   */
  function handleEntryShown(entry){
    mWrap.classList.toggle('selected',entry&&entry.info===info)
  }

  return event
}