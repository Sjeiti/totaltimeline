/**
 * @namespace totaltimeline.location
 */
iddqd.ns('totaltimeline.location',(function(iddqd,history){
	'use strict';

	var slug = totaltimeline.string.slug
		,time = totaltimeline.time
		,formatAnnum = time.formatAnnum
		,log
		,oRange
		,sLocationOriginalPath = location.pathname
		,sLocationBase = location.origin+'/'+(sLocationOriginalPath.match(/[^\/]+/g)||['']).shift()
		,sDocumentTitle = document.title
	;

	function init(model){
		log = totaltimeline.view.log;
		oRange = model.range;
		//
		oRange.change.add(handleRangeChange);
		window.addEventListener('popstate', handlePopstate, false);
		//
		model.entryShown.add(handleEntryShown);
		//
		oRange.set(time.UNIVERSE,time.NOW);
		updated(location.hash.substr(1));
	}

	function handleRangeChange(){
		if (oRange.start.ago===time.UNIVERSE&&oRange.end.ago===time.NOW) {
			update();
		} else {
			update(
				formatAnnum(oRange.start.ago,2,false)
				,formatAnnum(oRange.end.ago,2,false)
			);
		}
	}

	function handlePopstate() {
		/*log('popstate');
		log.watch('history.state',history.state);
		log.watch('location.href',location.href);
		log.watch('location.hash',location.hash);
		log.watch('location.pathname',location.pathname);*/
		updated(location.pathname.substr(1),location.hash.substr(1));
	}

	function handleEntryShown(event){
		// todo: set location
		console.log('handleEntryShown'
			,event.info
			,slug(event.info.name)
		); // log
//		history.pushState('','foobar',slug(event.info.name));
//		var sNewPath = start===undefined?sLocationOriginalPath:sLocationBase +start+'/'+end
		history.pushState('','foobar',sLocationBase+slug(event.info.name));
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
			,aAgo = [];
		if (sPath.length>0) {
			aPath = sPath.split('/');
			if (aPath.length>=2) {
				for (var i=0;i<2;i++) {
					aAgo.push(time.unformatAnnum(aPath[i]));
				}
//				oRange.set.apply(oRange,aAgo);
				oRange.animate.apply(oRange,aAgo);
			}
		} else {
			oRange.animate(time.UNIVERSE,time.NOW);
		}
	}

	/**
	 * Update option selection variable and try to call pushState.
	 * @param {string} [start] Start time
	 * @param {string} [end] End time
	 * @param {string} [subject] Optional subject
	 */
	function update(start,end,subject){
		//console.log('location.update',start,end,subject); // log
		var currentState = history.state;
		log.watch('currentState',currentState);
		if (sLocationOriginalPath.indexOf(start)!==-1) {
			sLocationOriginalPath = sLocationOriginalPath.split(start).shift();
		}
		if (history.pushState) {//todo:what if no pushstate
			var sPath = location.pathname
				//,sNewPath = slug===undefined?sLocationBase:sLocationBase+'/'+slug
				,sNewPath = start===undefined?sLocationOriginalPath:sLocationBase +start+'/'+end
			;
			if (sNewPath!==sPath) {
				//(location.pathname==='/'?history.pushState:history.replaceState)('','foobar',sNewPath);
				if (location.pathname==='/') {
					history.pushState('','foobar',sNewPath);
				} else {
					history.replaceState('','foobar',sNewPath);
				}
			}
		}
		document.title = sDocumentTitle + ' ' + oRange.start + ' - ' + oRange.end;
		if (subject) {
			console.log('subject',subject); // log
		}
	}

	function set(){

	}
	return iddqd.extend(init,{
		set: set
	});
})(iddqd,window.history));