import collections from './'
import Signal from 'signals'
import model from '../model'
import {fetchJson} from '../fetchJson'
import {assignable,emptyNode} from '../util'

/**
 * An object instance created by the factory method {@link collection.add}
 * @typedef {Array} collectionInstance
 * @property {Element} wrapper The wrapper element (has the event listeners for the collections instances).
 * @property {DocumentFragment} fragment A document fragment re-used for populating the wrapper element.
 * @property {function} populate Populates the view for a specific {@link time.range|range}.
 * @property {function} getData Initialises the Ajax call to load the spreadsheet data.
 * @property {Signal} dataLoaded Signal that fires when the spreadsheet data is loaded.
 */

/**
 * Callback method for the Ajax spreadsheet request.
 * @callback collectionDataCallback
 * @param {object} sheet The spreadsheet object.
 * @see https://developers.google.com/gdata/samples/spreadsheet_sample
 * @see https://developers.google.com/google-apps/spreadsheets/
 */

/**
 * The callback method that populates the collections.
 * @callback collectionPopulateCallback
 * @param {DocumentFragment} fragment The fragment to populate. Fragment itself is added in {@link collectionInstance.populate | the collections instance object}.
 * @param {time.range} range The {@link time.range|time range} to apply.
 */

const assignableArrayPrototype = assignable(Array.prototype)
  ,collectionViewInstancePrototype = Object.assign({
    /**
     * Initialise
     * @returns {totaltimeline.collection}
     */
    init(slug,jsonName,callback){
      this.wrapper.classList.add(slug)
      this.wrapper.addEventListener('click', this._handleWrapperClick, false)
      fetchJson(jsonName).then(callback.bind(this))
      return this
    }
    /**
     * Populates the collections wrapper for a specific {@link totaltimeline.time.range|time range}.
     * @memberof collectionInstance
     */
    ,populate(view,range){
      // todo: refactor more efficiently: only add/remove what is needed
      if (!!this._staticView) {
        this._populateInstance.call(this,null,range) // todo bind earlier
      } else {
        emptyNode(this.wrapper)
        emptyNode(this.fragment)
        this._populateInstance.call(this,this.fragment,range) // todo bind earlier
        this.wrapper.appendChild(this.fragment);//.cloneNode(true)
      }
      if (this.wrapper.parentNode!==view) {
        view.appendChild(this.wrapper)
      }
    }
    /**
     * Handles the click event on the wrapper.
     * @param {MouseEvent} e
     */
    ,_handleWrapperClick(e) {
      const target = e.target
        ,targetModel = target.model
      targetModel&&targetModel.info&&model.entryShown.dispatch(targetModel)
    }
  },assignableArrayPrototype)

/**
 * Collection factory
 * todo: explain click event listener
 * @method
 * @param {string} slug The name of the collections (will serve as classname in the view).
 * @param {string} jsonName The Google spreadsheet uri containing the collections data.
 * @param {collectionDataCallback} callback The callback uri to process the collections data.
 * @param {collectionPopulateCallback} populateInstance The method that populates the collections.
 * @param {object} staticView ?????????????? todo what is staticView?
 * @returns {collectionInstance} Collection instance object.
 */
export default function collection(slug,jsonName,callback,populateInstance,staticView){

  return collections.add(Object.create(collectionViewInstancePrototype,{
    length: {value:0,writable:true}
    ,wrapper: {value:document.createElement('div')}
    ,fragment: {value:document.createDocumentFragment()}
    ,dataLoaded: {value:new Signal()}
    ,_populateInstance: {value:populateInstance}
    ,_staticView: {value:staticView}
  }).init(slug,jsonName,callback))
}