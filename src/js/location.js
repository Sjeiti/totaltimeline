/**
 * Module governing route changes
 * @module location
 */

import time from './time'
import collections from './collections'
import about from './collections/about'
import model from './model'
import content from './view/content'

const history = window.history
const formatAnnum = time.formatAnnum
const entryShown = model.entryShown
const visibleRange = model.range
const pathname = location.pathname.substr(1)
let locationOriginalPath = location.pathname
const documentTitle = document.title
let isFirstChange = true
let hash = location.hash.substr(1)
const search = location.search.substr(1).split(/&/g)
  .map(kv=>kv.split(/=/))
  .reduce((p,c)=>(p[c[0]] = c[1],p), {})
const searchQuery = search.q||''

// fist set hash according to incoming uri
if (hash!==pathname) {
  hash = pathname
} else if (hash!==searchQuery) {
  hash = searchQuery
}

visibleRange.change.add(onRangeChange)
window.addEventListener('popstate', onPopstate, false)
entryShown.add(onEntryShown)

visibleRange.set(time.UNIVERSE,time.NOW)
updated(hash)

/**
 * Update location when range changes
 */
function onRangeChange(){
  if (visibleRange.start.ago===time.UNIVERSE&&visibleRange.end.ago===time.NOW) {
    update()
  } else {
    const contentInstance = content.get()
    const currentEntry = contentInstance&&contentInstance.currentEntry
    update(currentEntry,visibleRange)
  }
}

/**
 * Update location on window.popstate
 */
function onPopstate() {
  updated(location.pathname.substr(1),location.hash.substr(1))
}

/**
 * Update location when an entry is shown
 * @param {collectionEntry} collectionEntry
 */
function onEntryShown(collectionEntry){
  update(collectionEntry,visibleRange)
}

/**
 * Handles changes after location has changed.
 * @param {string} path Path without leading slash (or hash)
 * @param {string} hash
 */
function updated(path,hash){
  const hasNoHash = hash===undefined||hash===''
  const pathOrHash = hasNoHash?path:hash
  if (pathOrHash.length>0) {
    const splitPath = pathOrHash.split('/')
    const pathLength = splitPath.length
    // Event
    if  (pathLength===1||pathLength===3) {
      const locationSlug = splitPath[0]
      if (collections.length!==collections.loaded) {
        collections.dataLoaded.add(showSlugEntry.bind(null,locationSlug))
      } else {
        showSlugEntry(locationSlug)
      }
    }
    // Range
    if (pathLength>=2) {
      const isPathLength2 = pathLength===2
      const agoStart = time.unformatAnnum(splitPath[isPathLength2?0:1])
      const agoEnd = time.unformatAnnum(splitPath[isPathLength2?1:2])

      // don't animate the very first time
      if (isFirstChange) {
        visibleRange.set(agoStart,agoEnd)
        isFirstChange = false
      } else {
        visibleRange.animate(agoStart,agoEnd)// callback
      }
    }
  } else {
    visibleRange.animate(time.UNIVERSE,time.NOW)
  }
}

/**
 * Display information by slug
 * @param {string} slug
 */
function showSlugEntry(slug){
  const oSlugInst = collections.getEntryBySlug(slug)
  //////////////////////////////////
  if (!oSlugInst&&slug==='totaltimeline') {
    // todo: check distance before animating
    visibleRange.animate(time.UNIVERSE,time.YEAR_NOW)
      .then(entryShown.dispatch.bind(entryShown,about))
  }
  //////////////////////////////////
  if (oSlugInst) {
    collections.dataLoaded.remove(showSlugEntry)
    entryShown.dispatch(oSlugInst)
  }
}

let timeoutID = 0
const stringEmpty = ''
const stringSlash = '/'
const stateTitle = 'title'

/**
 * Update option selection variable and try to call pushState.
 * @param {event} [event] Optional current event.
 * @param {range} [range] The current range.
 */
function update(event,range){
  const {pathname} = location
  const slugStart = range&&formatAnnum(range.start.ago,2,false)
  const slugEnd = range&&formatAnnum(range.end.ago,2,false)
  if (range&&locationOriginalPath.indexOf(slugStart)!==-1) { // why?
    locationOriginalPath = locationOriginalPath.split(slugStart).shift()
  }
  const pathList = ['']

  if (event) pathList.push(event.info.slug)
  if (range) {
    pathList.push(slugStart)
    pathList.push(slugEnd)
  }
  const pathnameNew = pathList.join(stringSlash)
  if (pathnameNew!==pathname) {
    clearTimeout(timeoutID)
    const setState = pathname===stringSlash?history.pushState:history.replaceState
    const setSateAndTitle = combine(
      setState.bind(history, stringEmpty,stateTitle,pathnameNew)
      , setDocumentTitle.bind(null, event, range)
    )
    timeoutID = setTimeout(setSateAndTitle, 300)
  }
  // setDocumentTitle(event,range)
}

/**
 * Update the document title depending on event and range
 * IE: First trees | 2 Ga - 3 Ma | TotalTimeline
 * @param {event} [event]
 * @param {range} [range]
 */
function setDocumentTitle(event,range){
  document.title = `${event?`${event.info.name} | ${event.moment} | `:range?`${visibleRange.start} - ${visibleRange.end} | `:''}${documentTitle}`
}

function combine(...functions){
  return ()=>functions.forEach(fnc=>fnc())
}