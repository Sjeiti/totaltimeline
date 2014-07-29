/**
 * @namespace totaltimeline.location
 */
iddqd.ns('totaltimeline.location',(function(history){
	'use strict';

	var slug = totaltimeline.string.slug
		,time = totaltimeline.time
		,formatAnnum = time.formatAnnum
		,log
		,oModel
		,oRange
		,sLocationOriginalPath = location.pathname
//		,sLocationBase = location.origin+'/'+(sLocationOriginalPath.match(/[^\/]+/g)||['']).shift()
		,sDocumentTitle = document.title
	;

	function init(model){
		oModel = model;
		//
		log = totaltimeline.view.log;
		oRange = oModel.range;
		//
		oRange.change.add(handleRangeChange);
		window.addEventListener('popstate', handlePopstate, false);
		//
		oModel.entryShown.add(handleEntryShown);
		//
		oRange.set(time.UNIVERSE,time.NOW);
		updated(location.hash.substr(1));
		//console.log('init',location.hash.substr(1)); // log
	}

	// todo: document
	function handleRangeChange(){
		if (oRange.start.ago===time.UNIVERSE&&oRange.end.ago===time.NOW) {
			update();
		} else {
			/*update(
				formatAnnum(oRange.start.ago,2,false)
				,formatAnnum(oRange.end.ago,2,false)
			);*/
			//oModel.view.content.currentEntry
			update(totaltimeline.view.content.currentEntry,oRange);// todo: not null if something is selected
		}
	}

	// todo: document
	function handlePopstate() {
		/*log('popstate');
		log.watch('history.state',history.state);
		log.watch('location.href',location.href);
		log.watch('location.hash',location.hash);
		log.watch('location.pathname',location.pathname);*/
		updated(location.pathname.substr(1),location.hash.substr(1));
	}

	// todo: document
	function handleEntryShown(event){
		update(event,oRange);
	}

	/**
	 * Handles changes after location has changed.
	 * @param {string} path Path without leading slash (or hash)
	 */
	function updated(path,hash){
		//log('location.updated',path,':',hash);
		var bNoHash = hash===undefined||hash===''
			,sPath = bNoHash?path:hash
		;
		var aPath
			,iPath;
		if (sPath.length>0) {
			aPath = sPath.split('/');
			iPath = aPath.length;
			// Event
			if  (iPath===1||iPath===3) {
				var sLocationSlug = aPath[0]
					,oCollection = totaltimeline.collection
					,showSlugInstance = function(){
//						console.log('showSlugInstance'); // log
						var oSlugInst = oCollection.getEntryBySlug(sLocationSlug);
						if (oSlugInst) {
							oCollection.dataLoaded.remove(showSlugInstance);
//							setTimeout(oModel.entryShown.dispatch.bind(this,oSlugInst), 140 );
							oModel.entryShown.dispatch(oSlugInst);
						}
					}
				;
				if (oCollection.length!==oCollection.loaded) {
					oCollection.dataLoaded.add(showSlugInstance);
				} else {
					showSlugInstance();
				}
			}
			// Range
			if (iPath>=2) {
				var bPath2 = iPath===2
					,iAgoStart = time.unformatAnnum(aPath[bPath2?0:1])
					,iAgoEnd = time.unformatAnnum(aPath[bPath2?1:2])
				;
				oRange.animate(iAgoStart,iAgoEnd,function(){
					console.log('doneanimating'); // log
				});
			}
		} else {
			oRange.animate(time.UNIVERSE,time.NOW);
		}
	}

	/**
	 * Update option selection variable and try to call pushState.
	 * @param {totaltimeline.collection.events.event} [event] Optional current event.
	 * @param {range} [range] The current range.
	 */
	function update(event,range){
		//console.log('location.update',!!event,!!range); // log
		var currentState = history.state
			,sSlugStart = range&&formatAnnum(range.start.ago,2,false)
			,sSlugEnd = range&&formatAnnum(range.end.ago,2,false)
		;
		//console.log('history.state',currentState); // log;
		//log.watch('history.state',currentState);
		//
		//console.log('sLocationOriginalPath',sLocationOriginalPath); // log
		if (range&&sLocationOriginalPath.indexOf(sSlugStart)!==-1) { // why?
			sLocationOriginalPath = sLocationOriginalPath.split(sSlugStart).shift();
		}
		if (history.pushState) {//todo:what if no pushstate
			var aPath = ['']
				,sPath = location.pathname
				,sNewPath
			;
			if (event) aPath.push(slug(event.info.name));
			if (range) {
				aPath.push(sSlugStart);
				aPath.push(sSlugEnd);
			}
			sNewPath = aPath.join('/');
			//console.log('path\n\told: ',sPath,'\n\tnew: ',sNewPath); // log
			if (sNewPath!==sPath) {
				//(location.pathname==='/'?history.pushState:history.replaceState)('','foobar',sNewPath);
				if (location.pathname==='/') {
					history.pushState('','foobar',sNewPath);
				} else {
					history.replaceState('','foobar',sNewPath);
				}
			}
		}
		setDocumentTitle(event,range);
	}

	// todo: document
	function setDocumentTitle(event,range){
		// First trees | 2 Ga - 3 Ma | TotalTimeline
		document.title = sDocumentTitle
			+(event?' - '+event.info.name:'')
			+(range?' ' + oRange.start + ' - ' + oRange.end:'')
		;
	}

	return init;
})(window.history));