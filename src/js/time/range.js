import time from './'
import moment from './moment'
import animate from '../animate'
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
 */
const proto = {
	toString(){return '[object range, '+this.start.toString()+' - '+this.end.toString()+']';}

	/**
	 * Set both start and end time.
	 * Method can be overloaded by either using only a range as the first parameter, or a number for both parameters.
	 * @param {number|range} startAgo
	 * @param {number} endAgo
	 */
  ,set(startAgo,endAgo){
		if (arguments.length===1) { // assume range
			endAgo = startAgo.end.ago
			startAgo = startAgo.start.ago
		}
		this.start.set(startAgo,false)
		this.end.set(endAgo)
		if (this.min&&this.start.ago>this.min.ago) {
			// todo: implement without moveStart and only calling start.set and end.set once
			this.moveStart(this.min.ago)
		}
		// todo: implement max
    // todo: return this
	}

	// todo: document // no overload! (see set)
  // todo: callback to promise
  // todo: override existing animation
	,animate(startAgo,endAgo,callback){
		/*if (arguments.length===1) { // assume range
			endAgo = startAgo.end.ago;
			startAgo = startAgo.start.ago;
		}*/
		const iStartFrom = this.start.ago
			,iStartDelta = startAgo - iStartFrom
			,iEndFrom = this.end.ago
			,iEndDelta = endAgo - iEndFrom
		animate(1000,f=>{
			const fInOut = animate.quadratic.inOut(f)
			this.set(iStartFrom+fInOut*iStartDelta,iEndFrom+fInOut*iEndDelta)
		},callback)
	}

  /**
	 * Moves the range by setting the start moment. End moment is recalculated.
	 * Duration stays the same so end and start are set without dispatching moment.change.
	 * @param {number} ago
	 * @fires Change signal.
	 */
	,moveStart(ago) {
		if (this.min&&ago>this.min.ago) {
			this.end.ago += ago-this.min.ago
			ago = this.min.ago
		}
		// todo: implement max
		this.start.set(ago,false)
		this.end.set(ago-this.duration,false)
		this._dispatchChange()
	}

	/**
	 * todo:document
	 * @param {moment|range} time
	 * @returns {boolean}
	 */
  ,coincides(t){
		let bCoincides = false
		if (t.factory===moment) {
			bCoincides = this._momentInside(t);
		} else {
			var iStart = this.start.ago
				,iEnd = this.end.ago
				,iRStart = t.start.ago
				,iREnd = t.end.ago;
			bCoincides = this._momentInside(t.start)
				||this._momentInside(t.end)
				||iStart<=iRStart&&iEnd>=iREnd
				||iStart>=iRStart&&iEnd<=iREnd
		}
		return bCoincides;
	}

  // todo: document... maybe remove
  ,clone(){
    return range(this.start.clone(),this.end.clone())
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
  		console.log('_setDuration',start||this.start,end||this.end); // todo: remove log
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
function range(start,end,min,max){
  // todo: moment.types should be the same
  const writable = true
    ,inst = Object.create(proto,{
      start: {value:start}
      ,end:  {value:end}
      ,min:  {value:min}
      ,max:  {value:max}
      ,oldStartAgo: {value:start.ago}
      ,oldEndAgo: {value:end.ago}
      ,oldRange: {writable}
      ,change: {value:new Signal()}
      ,duration: {writable}
      ,factory: {value:range} // todo: remove
    })
	// todo: check if start > end
  inst._setDuration()
	inst.start.change.add(inst._onChange.bind(inst))
	inst.end.change.add(inst._onChange.bind(inst))

	return inst
}

export default range
