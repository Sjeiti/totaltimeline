import Signal from 'signals'
import model from '../model'
import {getData as getJsonData} from '../spreadsheetProxy'

/**
 * Callback method for the Ajax spreadsheet request.
 * @callback collectionDataCallback
 * @param {object} sheet The spreadsheet object.
 * @see https://developers.google.com/gdata/samples/spreadsheet_sample
 * @see https://developers.google.com/google-apps/spreadsheets/
 */

/**
 * The callback method that populates the collection.
 * @callback collectionPopulateCallback
 * @param {DocumentFragment} fragment The fragment to populate. Fragment itself is added in {@link collectionInstance.populate | the collection instance object}.
 * @param {totaltimeline.time.range} range The {@link time.range|time range} to apply.
 */

/**
 * An object instance created by the factory method {@link collection.add}
 * @typedef {Array} collectionInstance
 * @property {Element} wrapper The wrapper element (has the event listeners for the collection instances).
 * @property {DocumentFragment} fragment A document fragment re-used for populating the wrapper element.
 * @property {function} populate Populates the view for a specific {@link time.range|range}.
 * @property {function} getData Initialises the Ajax call to load the spreadsheet data.
 * @property {Signal} dataLoaded Signal that fires when the spreadsheet data is loaded.
 */

/**
 * A collection of {@link collectionInstance}s
 * @namespace totaltimeline.collection
 * @property {number} length
 */

const sgCollectionDataLoaded = new Signal()
  //
  ,referenceItem = []
  ,referenceSlug = []
  ,referenceName = []
  //
  ,collection = Object.assign([],{
    length: 0
    , rnd: Math.random()
    , loaded: 0
    ,dataLoaded: sgCollectionDataLoaded
    /**
     * Adds a new collection type to the timeline.
     * todo: explain click event listener
     * @name totaltimeline.collection.add
     * @method
     * @param {string} slug The name of the collection (will serve as classname in the view).
     * @param {string} jsonName The Google spreadsheet uri containing the collection data.
     * @param {collectionDataCallback} callback The callback uri to process the collection data.
     * @param {collectionPopulateCallback} populateInstance The method that populates the collection.
     * @param {object} staticView ?????????????? todo what is staticView?
     * @return {collectionInstance} Collection instance object.
     */
    ,add(slug,jsonName,callback,populateInstance,staticView){
    //    sheetUri = sheetUri.replace(/key/,totaltimeline.model.spreadsheetKey)

      const aCollection = []
        ,elmWrapper = document.createElement('div')
        ,elmFragment = document.createDocumentFragment()
        ,sgDataLoaded = new Signal()
        ,isStaticView = !!staticView
        ,oReturn = Object.assign(aCollection,{
          wrapper: elmWrapper
          ,fragment: elmFragment
          ,dataLoaded: sgDataLoaded
          ,populate
          ,getData: ()=>getJsonData(jsonName).then(callback)
        })

      elmWrapper.classList.add(slug)
      elmWrapper.addEventListener('click', handleWrapperClick, false)

      collection.push(oReturn)
      sgDataLoaded.add(handleDataLoaded,null,-1); // should be the last to called

      /**
       * Handles the click event on the wrapper.
       * @param {MouseEvent} e
       */
      function handleWrapperClick(e) {
        const target = e.target
          ,targetModel = target.model
        targetModel&&targetModel.info&&model.entryShown.dispatch(targetModel)
      }

      /**
       * Handles sgDataLoaded signal. At this point the collection instance has finished processing the loaded data.
       * @param collectionInstance
       */
      function handleDataLoaded(collectionInstance){
        collectionInstance.forEach(item=>{
          const {name,slug} = item
          referenceItem.push(item)
          referenceSlug.push(slug)
          referenceName.push(name)
        })
        collection.loaded++
        sgCollectionDataLoaded.dispatch(collectionInstance)
      }

      /**
       * Populates the collection wrapper for a specific {@link totaltimeline.time.range|time range}.
       * @memberof collectionInstance
       */
      function populate(view,range){
        // todo: refactor more efficiently: only add/remove what is needed
        if (isStaticView) {
          populateInstance(null,range)
        } else {
          emptyView(elmWrapper)
          emptyView(elmFragment)
          populateInstance(elmFragment,range)
          elmWrapper.appendChild(elmFragment);//.cloneNode(true)
        }
        if (elmWrapper.parentNode!==view) {
          view.appendChild(elmWrapper)
        }
      }

      /**
       * Removes all children from an HTMLElement.
       * @param {HTMLElement} element
       */
      function emptyView(element){ // todo: move to utils
        while (element.firstChild) element.removeChild(element.firstChild)
      }

      return oReturn
    }
    /**
     * Populates all the collections for a range into a view.
     * @name totaltimeline.collection.populate
     * @method
     * @param {HTMLElement} view
     * @param {range} range
     */
    ,populate(view,range) {
      collection.forEach(function(collectionInstance){
        collectionInstance.populate(view,range)
      })
    }
    /**
     * Get an entry by slug
     * @param {string} slug
     * @returns {*}
     * @todo: document
     * @todo: check name: is it entry or item or what
     */
    ,getEntryBySlug(slug){
      let entry
      const iIndex = referenceSlug.indexOf(slug)
      if (iIndex!==-1) {
        entry = referenceItem[iIndex]
      }
      return entry
    }
  })

sgCollectionDataLoaded.add(handleCollectionDataLoaded)



/**
 * All data is loaded so we now cross-reference text with anchors.
 * todo: refactor more effeciently
 * todo: replace strings more accurately (spaces and points)
 */
function handleCollectionDataLoaded(){
  for (let i=0,j=referenceItem.length;i<j;i++) {
    const oItem = referenceItem[i]
      ,oInfo = oItem.info
    let sCopy = oInfo.wikimedia

    if (sCopy) {
      for (let m=0,n=referenceSlug.length;m<n;m++) {
        if (m!==i) {
          const sSlug = referenceSlug[m]
          let sName = referenceName[m]
            ,rxMatch = new RegExp('([\\s]('+sName+')[^a-z])','i')
            ,aMatch = sCopy.match(rxMatch)
            ,bMatch = !!aMatch

          if (!bMatch) {
            const oRefItem = referenceItem[m]
              ,oRefInfo = oRefItem.info
              ,aTags = oRefInfo.tags
              ,iTags = aTags.length

            for (let k=0;k<iTags;k++) {
              sName = aTags[k]
              rxMatch = new RegExp('([\\s]('+sName+')[^a-z])','i')
              aMatch = sCopy.match(rxMatch)
              bMatch = !!aMatch
              if (bMatch) break
            }
          }
          if (sSlug!==oInfo.slug&&bMatch) {
            sCopy = sCopy.replace(rxMatch,'<a href="#'+sSlug+'">$1</a>')
          }
          oInfo.wikimedia = sCopy
        }
      }
    }
  }
}

export default collection
