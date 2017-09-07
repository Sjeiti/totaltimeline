/**
 * A collection of {@link collectionInstance}s
 * @module collections
 * @property {number} length
 */
import Signal from 'signals'
import {assignable} from '../util'

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
     * @name collections.add
     * @method
     * @param {collectionInstance} collection The collection instance to add
     * @returns {collectionInstance} Collection instance object.
     */
    add(collection){
      this.push(collection)
      collection.dataLoaded.add(this._onDataLoaded.bind(this),null,-1); // should be the last to called
      return collection
    }
    /**
     * Handles dataLoaded signal. At this point the collections instance has finished processing the loaded data.
     * @param collectionInstance
     */
    ,_onDataLoaded(collectionInstance){
      collectionInstance.forEach(item=>{
        const {name,slug} = item.info
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
    /**
     * Get a range of an entry based on closest entries
     * @param {object} entry
     * @param {number} numCloseEntries
     * @returns {number[]}
     */
    ,getEntryRange(entry, numCloseEntries){
      const index = referenceItem.indexOf(entry)
        ,entryRange = entry.range
      let range = entryRange&&[entryRange.start.ago,entryRange.end.ago]||null
      if (!range&&index!==-1) {
        const halfCloseEntries = numCloseEntries/2<<0
          ,indexStart = Math.max(index - halfCloseEntries, 0)
          ,indexEnd = Math.min(indexStart + numCloseEntries + 1, referenceItem.length - 1)
          ,entryStart = referenceItem[indexStart]
          ,entryEnd = referenceItem[indexEnd]
        range = [entryStart,entryEnd].map(entry=>entry.moment.ago)
      }
      return range
    }
    /**
     * All data is loaded so we now cross-reference text with anchors.
     * todo: refactor more effeciently
     * todo: replace strings more accurately (spaces and points)
     */
    ,_onCollectionDataLoaded(){
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
  },assignableArrayPrototype)
  // collections properties
  ,{
    length: {value:0,writable}
    ,loaded: {value:0,writable}
    ,dataLoaded: {value:new Signal()}
  })

collections.dataLoaded.add(collections._onCollectionDataLoaded)

export default collections
