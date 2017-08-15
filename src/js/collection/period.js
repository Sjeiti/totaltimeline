
import model from '../model'
import {getFragment} from '../util'

const proto = {
  toString(){
    return '[object period, '+this.info.name+': '+this.range.start.toString()+' - '+this.range.end.toString()+']'
  }
  ,coincides(time){
    const coin = this.range.coincides(time.range||time)
    if (this.info.name==='Hadean') {
      console.log('coincides',coin,time,this.range); // todo: remove log
    }
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
  model.entryShown.add(handleEntryShown) // todo: not very efficient

  /**
   * Handles entryShown signal
   * @param {period|event} entry
   */
  function handleEntryShown(entry){
    const bIs = entry&&entry.info===info
    period.element.classList.toggle('selected',bIs)
    bIs&&model.range.animate(range.start.ago,range.end.ago)
  }

  return period
}