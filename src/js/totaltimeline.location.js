/**
 * @name location
 * @namespace totaltimeline
 */
iddqd.ns('totaltimeline.location',(function(iddqd){
	'use strict';

	var s = totaltimeline.string
		,time = totaltimeline.time
		,oRange
		,sLocationOriginalPath = location.pathname
		,sLocationBase = location.origin+'/'+(sLocationOriginalPath.match(/[^\/]+/g)||['']).shift()
	;

	function init(model){
		oRange = model.range;
		oRange.change.add(handleRangeChange);
//		console.log('sLocationOriginalPath',sLocationOriginalPath); // log
//		console.log('sLocationBase',sLocationBase); // log
		//
		// check location hash
		var sHash = location.hash
			,aHash;
		if (sHash.length>1) {
			aHash = sHash.substr(1).split('/');
			if (aHash.length>=2) {
				for (var i=0;i<2;i++) {
					var sMoment = aHash[i]
						,aString = sMoment.match(/[a-zA-Z]+/)
						,sString = aString?aString[0]:''
						,aNumber = sMoment.match(/[0-9\.]+/)
						,fNumber = parseFloat(aNumber[0])
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
					if (i===0) 		oRange.start.set(iAgo,false);
					else if (i===1)	oRange.end.set(iAgo);
//					console.log('fNumber',fNumber,sString,iAgo); // log

				}
			}
		}
//		console.log('sHash',sHash); // log
	}

	function handleRangeChange(){
		update(
			s.formatAnnum(oRange.start.ago,2,false)
			,s.formatAnnum(oRange.end.ago,2,false)
		);
		/*update(
			Math.round(oRange.start.ago)
			,Math.round(oRange.end.ago)
		);*/
	}

	/**
	 * Update option selection variable and try to call pushState
	 * @param {string} [slug] Optional slug to append
	 */
	function update(start,end,subject){
		if (sLocationOriginalPath.indexOf(start)!==-1) {
			sLocationOriginalPath = sLocationOriginalPath.split(start).shift();
		}
		if (window.history&&window.history.pushState) {
			var sPath = location.pathname
				//,sNewPath = slug===undefined?sLocationBase:sLocationBase+'/'+slug
				,sNewPath = start===undefined?sLocationOriginalPath:sLocationBase +start+'/'+end
			;
			if (sNewPath!==sPath) {
				window.history.pushState('','foobar',sNewPath);
			}
		}
	}

	function set(){

	}
	return iddqd.extend(init,{
		set: set
	});
})(iddqd));