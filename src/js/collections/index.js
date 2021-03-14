/**
 * A collection of {@link collectionInstance}s
 * @module collections
 * @property {number} length
 */
import Signal from 'signals'
import {assignable} from '../util'

function getAgo(item){
  return item&&item.moment&&item.moment.ago||item&&item.start&&item.start.ago||0
}

const itemsOrdered = []
const itemSlugMap = new Map()
//
const assignableArrayPrototype = assignable(Array.prototype)
//
const writable = true
export const collections = Object.create(Object.assign({
  /**
     * Adds a new collection type to the timeline.
     * @name collections.add
     * @method
     * @param {collectionInstance} collection The collection instance to add
     * @returns {collectionInstance} Collection instance object.
     */
  add(collection){
    this.push(collection)
    collection.dataLoaded.add(this._onDataLoaded.bind(this),null,-1) // should be the last to called
    return collection
  }
  /**
     * Handles dataLoaded signal. At this point the collections instance has finished processing the loaded data.
     * @param collectionInstance
     */
  ,_onDataLoaded(collectionInstance){
    collectionInstance.forEach(item=>{
      const {slug} = item.info
      itemsOrdered.push(item)
      itemSlugMap.set(slug,item)
    })
    this.loaded++
    this.dataLoaded.dispatch(collectionInstance)
    // sorted by ago
    itemsOrdered.sort((a,b)=>{
      return getAgo(a)>getAgo(b)?-1:1
    })
  }
  /**
     * Renders the collections
     * @param {range} range
     */
  ,render(range) {
    this.forEach(inst=>inst.render(range))
  }
  /**
     * Resize called from timeline
     * @param {number} w
     * @param {number} h
     * @param {range} range
     * @todo first resize should fire after dataLoaded (not inside this method)
     */
  ,resize(w,h,range){
    this.forEach(inst=>{
      inst.isDataLoaded
        &&inst.resize&&inst.resize(w,h,range)
        ||inst.dataLoaded.addOnce(()=>inst.resize&&inst.resize(w,h,range))
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
    return itemSlugMap.get(slug)
  }
  /**
     * Get a range of an entry based on the average distance of the closest entries
     * @param {object} entry
     * @param {number} numCloseEntries
     * @param {number} zoom
     * @returns {number[]}
     */
  ,getEntryRange(entry, numCloseEntries, zoom){
    const index = itemsOrdered.indexOf(entry)
    const entryRange = entry.range
    const ago = getAgo(entry)
    let range = entryRange&&[entryRange.start.ago,entryRange.end.ago]||null
    if (!range&&index!==-1) {
      const indexStart = Math.max(index - numCloseEntries, 0)
      const indexEnd = Math.min(index + numCloseEntries, itemsOrdered.length - 1)
      const entryStart = itemsOrdered[indexStart]
      const entryEnd = itemsOrdered[indexEnd]
      const entryStartAgo = getAgo(entryStart)||ago
      const entryEndAgo = getAgo(entryEnd)||ago
      const entryStartDiff = entryStartAgo - ago
      const entryEndDiff = ago - entryEndAgo
      const deltaDiff = (entryStartDiff===0||entryEndDiff===0)?2*zoom*(entryStartDiff+entryEndDiff):zoom*(entryStartDiff + entryEndDiff)/2
      range = [ago + deltaDiff, ago - deltaDiff]
    }
    return range
  }
  /**
     * All data is loaded so we now cross-reference text with anchors.
     * todo: refactor more efficiently
     * todo: replace strings more accurately (spaces and points)
     */
  ,_onCollectionDataLoaded(){
    itemsOrdered.forEach(item=>{
      const info = item.info
      let copy = info.wikimedia
      if (copy) {
        itemsOrdered.forEach(checkItem=>{
          if (item!==checkItem) {
            const checkInfo = checkItem.info
            const checkSlug = checkInfo.slug
            const checkName = checkInfo.name
            let rxMatch = new RegExp('([\\s]('+checkName+')[^a-z])','i')
            let matchString = copy.match(rxMatch)
            let isMatch = !!matchString
            // if no exact match try the tags
            if (!isMatch) {
              checkInfo.tags.forEach(checkName=>{
                if (!isMatch) {
                  rxMatch = new RegExp('([\\s]('+checkName+')[^a-z])','i')
                  matchString = copy.match(rxMatch)
                  isMatch = !!matchString
                }
              })
            }
            if (isMatch) {
              copy = copy.replace(rxMatch,'<a href="#'+checkSlug+'">$1</a>')
              info.wikimedia = copy
            }
          }
        })
      }
    })
  }
},assignableArrayPrototype)
// collections properties
,{
  length: {value:0,writable}
  ,loaded: {value:0,writable}
  ,dataLoaded: {value:new Signal()}
})

collections.dataLoaded.add(collections._onCollectionDataLoaded)
