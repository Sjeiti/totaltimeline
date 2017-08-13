import {random} from '../math/prng'
import model from '../model'
import {getFragment} from '../util'

/**
 * @name event
 * @param {moment} moment
 * @param {eventInfo} info
 */
export default function event(moment,info){
  var getPercentage = float=>100*float+'%'
    //
    ,mWrap = getFragment(`<div class="event-wrap"><time></time><div class="event"></div><h3><a href="${info.slug}">${info.name}</a></h3></div>`).firstChild
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
    ,oReturn = {
      toString: function(){return '[event \''+info.name+'\', '+moment.value+' '+moment.type+']';}
      ,moment: moment
      ,info: info
      ,element: mWrap
      ,inside: inside
    }
  ;
  mEvent.model = oReturn;
  mEvent.style.top = sTop;
  info.icon!==''&&mEvent.classList.add('icon-'+info.icon);

  mTitle.style.top = sTop;

  mTime.style.height = sHeight; // todo: less vars @eventIconSize
  mTime.setAttribute('data-after',moment.toString()); // todo: better as textContent

  model.entryShown.add(handleEntryShown);

  /*mWrap.addEventListener(s.click,function (e){
    console.log('clickEvent',e); // log
  });*/

  /**
   * Handles entryShown signal
   * @param {period|event} entry
   */
  function handleEntryShown(entry){
    // toggle won't work in Safari
    if (entry&&entry.info===info) {
      mWrap.classList.add('selected');
    } else {
      mWrap.classList.remove('selected');
    }
  }

  // todo: document
  function inside(is){
    //console.log('event.inside',is,mWrap.classList.contains(s.selected)); // log
    if (!is&&mWrap.classList.contains('selected')) {
      model.entryShown.dispatch();
    }
  }

  return oReturn;
}