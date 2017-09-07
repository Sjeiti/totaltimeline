/**
 * Module governing route changes
 * @module location
 */

import time from './time'
import collections from './collections'
import model from './model'
import content from './view/content'
import pages from './view/pages'

const history = window.history
  ,formatAnnum = time.formatAnnum
  ,entryShown = model.entryShown
  ,visibleRange = model.range
  ,pathname = location.pathname.substr(1)
let sLocationOriginalPath = location.pathname
  //,sLocationBase = location.origin+'/'+(sLocationOriginalPath.match(/[^\/]+/g)||['']).shift()
  ,sDocumentTitle = document.title
  ,bFirstChange = true
  ,hash = location.hash.substr(1)
  ,search = location.search.substr(1).split(/&/g)
    .map(kv=>kv.split(/=/))
    .reduce((p,c)=>(p[c[0]] = c[1],p), {})
  ,searchQuery = search.q||''

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
    update(content.currentEntry,visibleRange);// todo: not null if something is selected
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
  var bNoHash = hash===undefined||hash===''
    ,sPath = bNoHash?path:hash
    ,aPath
    ,iPath
  if (sPath.length>0) {
    aPath = sPath.split('/')
    iPath = aPath.length
    // Event
    if  (iPath===1||iPath===3) {
      var sLocationSlug = aPath[0]
      if (collections.length!==collections.loaded) {
        collections.dataLoaded.add(showSlugEntry.bind(null,sLocationSlug))
      } else {
        showSlugEntry(sLocationSlug)
      }
    }
    // Range
    if (iPath>=2) {
      var bPath2 = iPath===2
        ,iAgoStart = time.unformatAnnum(aPath[bPath2?0:1])
        ,iAgoEnd = time.unformatAnnum(aPath[bPath2?1:2])

      // don't animate the very first time
      if (bFirstChange) {
        visibleRange.set(iAgoStart,iAgoEnd)
        bFirstChange = false
      } else {
        visibleRange.animate(iAgoStart,iAgoEnd);// callback
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
  if (oSlugInst) {
    collections.dataLoaded.remove(showSlugEntry)
    entryShown.dispatch(oSlugInst)
    // zoom the entry with to n-closest entries
    const range = collections.getEntryRange(oSlugInst,20)
    range&&visibleRange.animate(...range)
  } else {
    const oPage = pages.getEntryBySlug(slug)
    oPage&&entryShown.dispatch({info:oPage})
  }
}

/**
 * Update option selection variable and try to call pushState.
 * @param {event} [event] Optional current event.
 * @param {range} [range] The current range.
 */
function update(event,range){
  // console.log('update',{event,range}); // todo: remove log
  //console.log('location.update',!!event,!!range); // log
  var /*currentState = history.state
    ,*/sSlugStart = range&&formatAnnum(range.start.ago,2,false)
    ,sSlugEnd = range&&formatAnnum(range.end.ago,2,false)

  //console.log('history.state',currentState); // log
  //log.watch('history.state',currentState)
  //
  //console.log('sLocationOriginalPath',sLocationOriginalPath); // log
  if (range&&sLocationOriginalPath.indexOf(sSlugStart)!==-1) { // why?
    sLocationOriginalPath = sLocationOriginalPath.split(sSlugStart).shift()
  }
  if (history.pushState) {//todo:what if no pushstate
    var aPath = ['']
      ,sPath = location.pathname
      ,sNewPath

    if (event) aPath.push(event.info.slug)
    if (range) {
      aPath.push(sSlugStart)
      aPath.push(sSlugEnd)
    }
    sNewPath = aPath.join('/')
    //console.log('path\n\told: ',sPath,'\n\tnew: ',sNewPath); // log
    if (sNewPath!==sPath) {
      //(location.pathname==='/'?history.pushState:history.replaceState)('','foobar',sNewPath)
      if (location.pathname==='/') {
        history.pushState('','foobar',sNewPath)
      } else {
        history.replaceState('','foobar',sNewPath)
      }
    }
  }
  setDocumentTitle(event,range)
}

/**
 * Update the document title depending on event and range
 * IE: First trees | 2 Ga - 3 Ma | TotalTimeline
 * @param {event} [event]
 * @param {range} [range]
 */
function setDocumentTitle(event,range){
  document.title = `${event?`${event.info.name} | ${event.moment} | `:range?`${visibleRange.start} - ${visibleRange.end} | `:''}${sDocumentTitle}`
}
