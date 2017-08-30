
import time from './time'
import collections from './collections'
import model from './model'
import content from './view/content'
import pages from './view/pages'

/**
 * @name location
 */

const history = window.history
	,formatAnnum = time.formatAnnum
	,entryShown = model.entryShown
	,oRange = model.range
	,sPath = location.pathname.substr(1)
let sLocationOriginalPath = location.pathname
//		,sLocationBase = location.origin+'/'+(sLocationOriginalPath.match(/[^\/]+/g)||['']).shift()
	,sDocumentTitle = document.title
	,bFirstChange = true
	,sHash = location.href.indexOf('#')!==-1?location.hash.substr(1):''
	,sGetQ = location.href.indexOf('?')!==-1?location.href.split('?q=').pop().split('#')[0]:''

if (sPath.indexOf('src/test/index.html')!==-1) {
	// prevent rewrite in test
} else {
	// fist set hash according to incoming uri
	if (sHash!==sPath) {
		sHash = sPath
	} else if (sHash!==sGetQ) {
		sHash = sGetQ
	}
	//
	//
	oRange.change.add(handleRangeChange)
	window.addEventListener('popstate', handlePopstate, false)
	//
	entryShown.add(handleEntryShown)
	//
	oRange.set(time.UNIVERSE,time.NOW)
	updated(sHash)
}


// todo: document
function handleRangeChange(){
	if (oRange.start.ago===time.UNIVERSE&&oRange.end.ago===time.NOW) {
		update()
	} else {
		update(content.currentEntry,oRange);// todo: not null if something is selected
	}
}

// todo: document
function handlePopstate() {
	updated(location.pathname.substr(1),location.hash.substr(1))
}

// todo: document
function handleEntryShown(event){
	update(event,oRange)
}

/**
 * Handles changes after location has changed.
 * @param {string} path Path without leading slash (or hash)
 */
function updated(path,hash){ // todo:document param
	console.log('updated',path,hash); // todo: remove log
	//console.log('location.updated',path,':',hash); // log
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
				collections.dataLoaded.add(showSlugInstance.bind(null,sLocationSlug))
			} else {
				showSlugInstance(sLocationSlug)
			}
		}
		// Range
		if (iPath>=2) {
			var bPath2 = iPath===2
				,iAgoStart = time.unformatAnnum(aPath[bPath2?0:1])
				,iAgoEnd = time.unformatAnnum(aPath[bPath2?1:2])

			// don't animate the very first time
			if (bFirstChange) {
				oRange.set(iAgoStart,iAgoEnd)
				bFirstChange = false
			} else {
				oRange.animate(iAgoStart,iAgoEnd);// callback
			}
		}
	} else {
		oRange.animate(time.UNIVERSE,time.NOW)
	}
}

// todo: document
function showSlugInstance(slug){
	console.log('showSlugInstance',slug); // log
	var oSlugInst = collections.getEntryBySlug(slug)
		,bHasSlugInst = !!oSlugInst
	if (bHasSlugInst) {
		collections.dataLoaded.remove(showSlugInstance)
		entryShown.dispatch(oSlugInst)
	} else {
		var oPage = pages.getEntryBySlug(slug)
		oPage&&entryShown.dispatch({info:oPage})
	}
}

/**
 * Update option selection variable and try to call pushState.
 * @param {event} [event] Optional current event.
 * @param {range} [range] The current range.
 */
function update(event,range){
	//console.log('update',event,range); // todo: remove log
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

// todo: document
function setDocumentTitle(event,range){
	// First trees | 2 Ga - 3 Ma | TotalTimeline
	document.title = sDocumentTitle
		+(event?' - '+event.info.name:'')
		+(range?' ' + oRange.start + ' - ' + oRange.end:'')

}
