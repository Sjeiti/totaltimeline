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

	/**
	 * Processes bower to enqueue script
	 */
	grunt.registerMultiTask('bower', 'Processes HTML', function() {
		var fs = require('fs')
			,oBower = JSON.parse(fs.readFileSync(this.data.json).toString())
			,oBowrc = JSON.parse(fs.readFileSync(this.data.bowerrc).toString())
			,oOverrides = oBowrc.overrides||{}
			,sBaseUri = oBowrc.directory
			,sDst = fs.readFileSync(this.data.dest).toString()
			,aBower = []
			,sSave
		;
		for (var dep in oBower.dependencies) {
			var oDepBower = JSON.parse(fs.readFileSync(sBaseUri+'/'+dep+'/.bower.json').toString())
				,oMain = oOverrides.hasOwnProperty(dep)&&oOverrides[dep].hasOwnProperty('main')?oOverrides[dep].main:oDepBower.main
				,aMain = isString(oMain)?[oMain]:oMain
				,sSrcBase = sBaseUri.replace(/^src\//,'')+'/'+dep+'/'
			;
			if (!oMain) {
				console.log(dep+' could not be added, add manually!'); // log
			} else {
				aMain.forEach(function(src){
					var sSrc = sSrcBase+(src[0]==='.'?src.substr(1):src);
					aBower.push('<script src="/'+sSrc+'"></script>');
				});
			}
		}
		sSave = blockReplace(sDst,aBower.join('\n'),'bower');
		fs.writeFileSync(this.data.dest,sSave);
		function isString(s){
			return typeof s==='string';
		}
	});

};