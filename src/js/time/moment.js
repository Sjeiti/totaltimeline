/**
 * An object instance created by the factory method {@link totaltimeline.time.moment}
 * @typedef {object} moment
 * @property {function} set
 * @property {string} type The type of the moment. Can be totaltimeline.time.moment.AGO
 * @property {Signal} change Signal dispatched when the value of the moment changes
 * @property {function} clone Clone the moment object.
 * @property {function} factory Direct link back to the original factory
 */
/*
 * A single moment in time
 * @namespace totaltimeline.time.moment
 * @property {function} set
 */
/*
 * @constant {string} SINCE
 * @constant {string} AGO
 * @constant {string} YEAR
 */
/**
 * A single moment in time
 * @name totaltimeline.time.moment
 * @method
 * @param {number} value
 * @param {string} type
 * @returns {moment}
 */
import time from './'
import {Signal} from 'signals'

const SINCE = 'since'
  ,AGO = 'ago'
  ,YEAR = 'year'
  //
  ,agoToYear =    value=>time.YEAR_NOW-value
  ,agoToSince =   value=>time.UNIVERSE-value
  ,yearToAgo =    value=>time.YEAR_NOW-value
  ,yearToSince =  value=>time.UNIVERSE-value
  ,sinceToAgo =   value=>time.UNIVERSE-value
  ,sinceToYear =  value=>time.YEAR_NOW-(time.UNIVERSE-value)
  //
  ,proto = {
    set(value,dispatch=true){
      // todo: update return value
      this.value = value
      if (this.type===SINCE) {
        this.ago = sinceToAgo(value)
        this.year = sinceToYear(value)
        this.since = value
      } else if (this.type===YEAR) {
        this.ago = yearToAgo(value)
        this.year = value
        this.since = yearToSince(value)
      } else {
        this.ago = value
        this.year = agoToYear(value)
        this.since = agoToSince(value)
      }
      dispatch&&this.change.dispatch(this.ago);
      return this
    }
    ,toString(){return time.formatAnnum(this.ago,2)}
    ,clone(){return moment(this.ago)}
  }

/**
 * @param {number} value The time value.
 * @param {string} [type=moment.AGO] Denotes what type of value is parsed: moment.AGO, moment.SINCE or moment.YEAR.
 */
function moment(value,type=AGO){
 
  const writable = true
    ,inst = Object.create(proto,{
      value: {writable,value}
      ,type: {value: type}
      ,change: {value: new Signal()}
      ,factory: {value: moment}
    })
  inst.set(value)
  return inst
}

export default Object.assign(moment,{
  SINCE
  ,AGO
  ,YEAR
})
