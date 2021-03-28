import {moment} from './moment'
import {animate} from '../animate'
import {UNIVERSE, NOW} from './'
import {Signal} from 'signals'

/**
 * An object instance created by the factory method {@link range}
 * @typedef {object} timeRange
 * @property {function} set
 * @property {moment} start
 * @property {moment} end
 * @property {moment} min
 * @property {moment} max
 * @property {number} duration
 * @property {Signal} change
 * @property {function} moveStart
 * @property {function} coincides
 * @property {function} clone
 * @property {function} factory Direct link back to the original factory
 * @property {number} lock
 */

export const lock = {
  NONE: 0
  ,START: 1
  ,END: 2
}

const proto = {
  toString(){return '[object range, '+this.start.toString()+' to '+this.end.toString()+']'}

  /**
     * Set both start and end time.
     * Method can be overloaded by either using only a range as the first parameter, or a number for both parameters.
     * @param {number|range} startAgo
     * @param {number} endAgo
     */
  ,set(startAgo,endAgo,dispatch=true){
    if (arguments.length===1) { // assume range
      endAgo = startAgo.end.ago
      startAgo = startAgo.start.ago
    }
    if (startAgo<endAgo) {
      [endAgo,startAgo] = [startAgo,endAgo]
    }
    if (this.min&&startAgo>this.min.ago) {
      startAgo = this.min.ago
    }
    const isLockStart = this._lock===lock.START
    const isLockEnd = this._lock===lock.END
    isLockStart||this.start.set(startAgo,dispatch)
    isLockEnd||this.end.set(endAgo,dispatch&&isLockStart)
    // todo: implement max
    // todo: return this
  }

  // todo: document // no overload! (see set)
  // todo: override existing animation
  ,animate(startAgo,endAgo){
    /*if (arguments.length===1) { // assume range
        endAgo = startAgo.end.ago;
        startAgo = startAgo.start.ago;
      }*/
    return new Promise(resolve=>{
      const startFrom = this.start.ago
      const startDelta = startAgo - startFrom
      const endFrom = this.end.ago
      const endDelta = endAgo - endFrom
      animate(1000,f=>{
        const inOut = animate.quadratic.inOut(f)
        this.set(startFrom+inOut*startDelta,endFrom+inOut*endDelta)
      },resolve)
    })
  }

  /**
     * Moves the range by setting the start moment. End moment is recalculated.
     * Duration stays the same so end and start are set without dispatching moment.change.
     * @param {number} ago
     * @fires Change signal.
     */
  ,moveStart(ago) {
    if (this._lock===lock.NONE) {
      if (this.min&&ago>this.min.ago) {
        this.end.ago += ago-this.min.ago
        ago = this.min.ago
      }
      this.set(ago,ago-this.duration,false)
      this._dispatchChange()
    }
  }

  /**
   * Test if range coincides with a time or range
   * @param {moment|range} time
   * @returns {boolean}
   */
  ,coincides(time){
    let isCoinciding = false
    if (time.factory===moment) {
      isCoinciding = this._momentInside(time)
    } else {
      const thisStart = this.start.ago
      const thisEnd = this.end.ago
      const timeStart = time.start.ago
      const timeEnd = time.end.ago
      isCoinciding = this._momentInside(time.start)
          ||this._momentInside(time.end)
          ||thisStart<=timeStart&&thisEnd>=timeEnd
          ||thisStart>=timeStart&&thisEnd<=timeEnd
    }
    return isCoinciding
  }

  /**
   * Clone the range
   * @return {timeRange}
   */
  ,clone(){
    return range(this.start.clone(),this.end.clone())
  }

  ,set lock(type){
    if (type===lock.START) {
      this.animate(UNIVERSE,this.end.ago)
        .then(()=>(this._lock = type))
    } else if (type===lock.END) {
      this.animate(this.start.ago,NOW)
        .then(()=>(this._lock = type))
    } else {
      this._lock = lock.NONE
    }
    this._setDuration()
  }

  ,get lock() {
    return this._lock
  }

  //todo:document
  ,_dispatchChange() {
    if (this.oldRange===undefined) { // only create oOldRange on dispatchChange to prevent recursion
      this.oldRange = range(moment(this.oldStartAgo),moment(this.oldEndAgo))
    }
    this.change.dispatch(this,this.oldRange)
    //
    this.oldRange.start.set(this.start.ago,false)
    this.oldRange.end.set(this.end.ago,false)
    //this.oldRange.duration = this.start.ago-this.end.ago
    this._setDuration(this.oldRange)
  }

  /**
     * Handles change in either start- or end moment by recalculating duration.
     * @fires Change signal.
     */
  ,_onChange(){
    this._setDuration()
    this._dispatchChange()
  }

  // todo: document
  ,_momentInside(mmt){
    return mmt.ago<=this.start.ago&&mmt.ago>=this.end.ago
  }

  // todo: document
  ,_setDuration(range,start,end){
    (range||this).duration = (start||this.start).ago-(end||this.end).ago
    if ((range||this).duration===-1) {
      console.log('_setDuration',start||this.start,end||this.end) // todo: remove log
    }
  }
}

/**
 * Factory method to create a range.
 * The timerange between two moments.
 * @name range
 * @method
 * @param {moment} start
 * @param {moment} end
 * @param {moment} min
 * @param {moment} max
 * @returns {timeRange}
 */
export function range(start,end,min,max){
  // todo: moment.types should be the same
  const writable = true
  const inst = Object.create(proto,{
    start: {value:start}
    ,end:  {value:end}
    ,min:  {value:min}
    ,max:  {value:max}
    ,oldStartAgo: {value:start.ago}
    ,oldEndAgo: {value:end.ago}
    ,oldRange: {writable}
    ,change: {value:new Signal()}
    ,duration: {writable}
    ,factory: {value:range}
    ,_lock: {value:lock.NONE,writable}
  })
  // todo: check if start > end
  inst._setDuration()
  inst.start.change.add(inst._onChange.bind(inst))
  inst.end.change.add(inst._onChange.bind(inst))
  return Object.assign(inst,{lock})
}
