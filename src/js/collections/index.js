import Signal from 'signals'
import {assignable} from '../util'

/**
 * A collection of {@link collectionInstance}s
 * @namespace collection
 * @property {number} length
 */

const referenceItem = []
  ,referenceSlug = []
  ,referenceName = []
  //
  ,assignableArrayPrototype = assignable(Array.prototype)
  //
  ,writable = true
  ,collections = Object.create(Object.assign({
    /**
     * Adds a new collection type to the timeline.
     * @name collection.add
     * @method
     * @param {collectionInstance} collection The collection instance to add
     * @returns {collectionInstance} Collection instance object.
     */
    add(collection){
      this.push(collection)
      collection.dataLoaded.add(this._handleDataLoaded.bind(this),null,-1); // should be the last to called
      return collection
    }
    /**
     * Handles dataLoaded signal. At this point the collections instance has finished processing the loaded data.
     * @param collectionInstance
     */
    ,_handleDataLoaded(collectionInstance){
      collectionInstance.forEach(item=>{
        const {name,slug} = item
        referenceItem.push(item)
        referenceSlug.push(slug)
        referenceName.push(name)
      })
      this.loaded++
      this.dataLoaded.dispatch(collectionInstance)
    }
    /**
     * Populates all the collections for a range into a view.
     * @name collection.populate
     * @method
     * @param {HTMLElement} view
     * @param {range} range
     */
    ,populate(view,range) {
      this.forEach(function(collectionInstance){
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
  },assignableArrayPrototype),{
    length: {value:0,writable}
    ,loaded: {value:0,writable}
    ,dataLoaded: {value:new Signal()}
  })

collections.dataLoaded.add(handleCollectionDataLoaded)

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

export default collections
