
import model from '../model'
import {getFragment} from '../util'

const proto = {
  toString(){
    return '[object period, '+this.info.name+': '+this.range.start.toString()+' - '+this.range.end.toString()+']'
  }
  ,coincides(time){
    return this.range.coincides(time.range||time)
  }
}

/**
 * @name period
 * @param {range} range
 * @param {eventInfo} info
 * @param {number} offset
 */
export default function period(range,info,offset){

  const period = Object.create(proto,{
    range: {value:range}
    ,info: {value:info}
    ,element: {value:getFragment(`<div class="period" style="margin-top:${1.5*offset}rem">
  <h3><a href="${info.slug}">${info.name} ${range.start.toString()} ${range.end.toString()}</a></h3>
</div>`).firstChild}
  })

  period.element.querySelector('h3').model = period
  model.entryShown.add(onEntryShown) // todo: not very efficient

  /**
   * Handles entryShown signal
   * @param {period|event} entry
   */
  function onEntryShown(entry){
    const isEntry = entry&&entry.info===info||false
    period.element.classList.toggle('selected',isEntry)
    isEntry&&model.range.animate(range.start.ago,range.end.ago)
  }

  return period
}