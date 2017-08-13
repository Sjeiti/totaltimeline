
import model from '../model'
import {getFragment} from '../util'

/**
 * @namespace totaltimeline.collection.periods.period
 * @param range {range}
 * @param info {eventInfo}
 */
export default function period(range,info,offset){

  const mElement = document.createElement('div')
    ,oReturn = {
      toString: function(){return '[object period, '+info.name+': '+range.start.toString()+' - '+range.end.toString()+']'}
      ,range: range
      ,info: info
      ,element: mElement
      ,coincides: coincides
    }

  mElement.classList.add('period')
  mElement.style.marginTop = 1.5*offset+'rem'; // todo: replace 1.5 by value from less

  // var mTitle = zen('h3>a[href=/'+info.slug+']{'+info.name + ' ' + range.start.toString() + ' - ' + range.end.toString()+'}').pop()
  const mTitle = getFragment(`<h3><a href="${info.slug}">${info.name} ${range.start.toString()} ${range.end.toString()}</a></h3>`).firstChild
  mTitle.model = oReturn

  mElement.appendChild(mTitle)
  model.entryShown.add(handleEntryShown); // todo: not very efficient

  /**
   * Handles entryShown signal
   * @param {period|event} entry
   */
  function handleEntryShown(entry){
    const bIs = entry&&entry.info===info
    mElement.classList.toggle('selected',bIs)
    bIs&&model.range.animate(range.start.ago,range.end.ago)
  }

  // todo:document
  function coincides(time){
    return range.coincides(time.factory===period?time.range:time)
  }

  return oReturn
}