import collections from './'
import Signal from 'signals'
import model from '../model'
import {fetchFile} from '../fetchProxy'
import {assignable} from '../util'

/**
 * An object instance created by the factory method {@link collection.add}
 * @typedef {Array} collectionInstance
 * @property {Element} wrapper The wrapper element (has the event listeners for the collections instances).
 * @property {DocumentFragment} fragment A document fragment re-used for populating the wrapper element.
 * @property {function} render Populates the view for a specific {@link time.range|range}.
 * @property {function} getData Initialises the Ajax call to load the spreadsheet data.
 * @property {Signal} dataLoaded Signal that fires when the spreadsheet data is loaded.
 */

/**
 * An event or period on the timeline
 * @typedef {object} collectionEntry
 * @property {HTMLElement} element
 * @property {eventInfo} info
 * @property {moment} [moment]
 * @property {range} [range]
 */

/**
 * Callback method for the Ajax spreadsheet request.
 * @callback collectionDataLoaded
 * @param {object} sheet The spreadsheet object.
 * @see https://developers.google.com/gdata/samples/spreadsheet_sample
 * @see https://developers.google.com/google-apps/spreadsheets/
 */

/**
 * The callback method that populates the collections.
 * @callback collectionRender
 * @param {time.range} range The {@link time.range|time range} to apply.
 */

const assignableArrayPrototype = assignable(Array.prototype)
  ,collectionViewInstancePrototype = Object.assign({

    /**
     * Initialise
     * @param {string} slug The name of the collections (will serve as classname in the view).
     * @param {string} dataFileName Filename for the collection data
     * @param {collectionDataLoaded} callback The callback uri to process the collections data.
     * @returns {collectionInstance}
     */
    init(slug,dataFileName,callback){
      this.wrapper.classList.add(slug)
      this.wrapper.addEventListener('click', this._onWrapperClick, false)
      this.dataLoaded.addOnce(this._onDataLoaded.bind(this))
      dataFileName&&fetchFile(dataFileName).then(callback.bind(this))||callback.call(this)
      return this
    }
    /**
     * Populates the collections wrapper for a specific {@link totaltimeline.time.range|time range}.
     * @memberof collectionInstance
     */
    ,render(range){
      this.isDataLoaded&&this._render.call(this,range)
    }
    ,_onDataLoaded(){
      this.isDataLoaded = true
    }
    ,_populateElements(elements){
      Array.from(this.wrapper.children).forEach(elm=>elements.includes(elm)||this.wrapper.removeChild(elm))
      elements.forEach(elm=>elm.parentNode!==this.wrapper&&this.fragment.appendChild(elm))
      this.wrapper.appendChild(this.fragment)
    }
    ,show(show){
      this.wrapper.classList.toggle('hide',!show)
    }
    /**
     * Handles the click event on the wrapper.
     * @param {MouseEvent} e
     */
    ,_onWrapperClick(e) {
      const target = e.target
        ,targetModel = target.model
      targetModel&&targetModel.info&&model.entryShown.dispatch(targetModel)
    }
  },assignableArrayPrototype)

/**
 * Collection factory
 * @method
 * @param {string} slug The name of the collections (will serve as classname in the view).
 * @param {string} dataFileName Filename for the collection data
 * @param {collectionDataLoaded} callback The callback uri to process the collections data.
 * @param {collectionRender} render The method that populates the collections.
 * @returns {collectionInstance} Collection instance object.
 */
export default function collection(slug,dataFileName,callback,render){
  return collections.add(Object.create(collectionViewInstancePrototype,{
    length: {value:0,writable:true}
    ,name: {value:slug}
    ,wrapper: {value:document.createElement('div')}
    ,fragment: {value:document.createDocumentFragment()}
    ,dataLoaded: {value:new Signal()}
    ,isDataLoaded: {value:false,writable:true}
    ,_render: {value:render}
  }).init(slug,dataFileName,callback))
}