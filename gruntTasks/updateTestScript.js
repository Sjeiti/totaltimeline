
module.exports = function(grunt) {
	'use strict';

	/**
	 * Replaces the block between comments marked by: '<!-- [id]:js -->' to '<!-- end[id] -->'
	 * @param source
	 * @param replace
	 * @param id
	 * @returns {string}
	 */
	function blockReplace(source,replace,id){
		var aSource = source.split(/\n\r|\n|\r/)
			,rxStart = new RegExp('<!--\\s?'+id+':js\\s?-->')
			,rxEnd = new RegExp('<!--\\s?end'+id+'\\s?-->')
			,bStarted = false
			,iStart = -1
			,aSourceNew = aSource.filter(function(line,i){
				var bReturn = true;
				if ((bStarted?rxEnd:rxStart).test(line)) {
					bStarted = !bStarted;
					if (bStarted) iStart = i;
				} else if (bStarted) {
					bReturn = false;
				}
				return bReturn;
			})
		;
		aSourceNew.splice(iStart+1,0,replace);
		return aSourceNew.join('\n');
	}

	grunt.registerMultiTask('updateTestScript', 'Convert svg icons to less file', function() {
		var fs = require('fs')
			,data = this.data
			,sSrc = fs.readFileSync(data.src).toString()
			,sDst = fs.readFileSync(data.dest).toString()
			,rxScript = /<script\ssrc="[^"]*"><\/script>/g
			,aScript = sSrc.match(rxScript)
			,sSave
		;
		if (aScript) {
			aScript = aScript.map(function(script){
				return script.replace(data.find,data.replace);
			});
		}
		sSave = blockReplace(sDst,aScript.join('\n'),'test');
		fs.writeFileSync(this.data.dest,sSave);
	});
};