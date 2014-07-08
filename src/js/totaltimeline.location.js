/**
 * @namespace totaltimeline.location
 */
iddqd.ns('totaltimeline.location',(function(iddqd,history){
	'use strict';

	var s = totaltimeline.string
		,time = totaltimeline.time
		,log
		,oRange
		,sLocationOriginalPath = location.pathname
		,sLocationBase = location.origin+'/'+(sLocationOriginalPath.match(/[^\/]+/g)||['']).shift()
	;

	function init(model){
		log = totaltimeline.view.log;
		oRange = model.range;
		//
		oRange.change.add(handleRangeChange);
		window.addEventListener('popstate', handlePopstate, false);
		//
		updated(location.hash.substr(1));
	}

	function handleRangeChange(){
		if (oRange.start.ago===time.UNIVERSE&&oRange.end.ago===time.NOW) {
			update();
		} else {
			update(
				s.formatAnnum(oRange.start.ago,2,false)
				,s.formatAnnum(oRange.end.ago,2,false)
			);
		}
	}

	function handlePopstate() {
		log('popstate');
		log.watch('history.state',history.state);
		log.watch('location.href',location.href);
		log.watch('location.hash',location.hash);
		log.watch('location.pathname',location.pathname);
		updated(location.pathname.substr(1));
	}

	/**
	 * Handles changes after location has changed.
	 * @param {string} path Path without leading slash
	 */
	function updated(path){
		log('location updated'
			,path,':'
			,location.hash
			,location.pathname
		);
		var aPath
			,aAgo = [];
		if (path.length>0) {
			aPath = path.substr(1).split('/');
			if (aPath.length>=2) {
				for (var i=0;i<2;i++) {
					var sMoment = aPath[i]
						,aString = sMoment.match(/[a-zA-Z]+/)
						,sString = aString?aString[0]:''
						,aNumber = sMoment.match(/[0-9\.]+/)
						,fNumber = parseFloat(aNumber[0])// todo: Uncaught TypeError: Cannot read property '0' of null
						,iAgo = fNumber
					;
					if (sString==='Ga') {
						iAgo = fNumber*1E9;
					} else if (sString==='Ma') {
						iAgo = fNumber*1E6;
					} else if (sString==='ka') {
						iAgo = fNumber*1E3;
					} else if (sString==='BC') {
						iAgo = fNumber + time.YEAR_NOW;
					} else if (sString==='AD') {
						iAgo = fNumber - time.YEAR_NOW;
					}
					// todo: not quite working yet for lower vs future: ie 1969 vs 3000 (make future notation similar to Ga)
					aAgo.push(iAgo);
				}
				oRange.set.apply(oRange,aAgo);
			}
		} else {
			oRange.set(time.UNIVERSE,time.NOW);
		}
	}

	/**
	 * Update option selection variable and try to call pushState.
	 * @param {string} [start] Start time
	 * @param {string} [end] End time
	 * @param {string} [subject] Optional subject
	 */
	function update(start,end,subject){

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