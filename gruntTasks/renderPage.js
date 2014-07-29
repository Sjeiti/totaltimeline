module.exports = function(grunt) {
'use strict';

	grunt.registerMultiTask('renderPage', 'Execute cli tasks', function(){

		var aEnd = ['spiral-galaxy','milky-way']
			,sUrl = 'http://localhost.ttl/'+aEnd[1]
			,sName = sUrl.split('/').pop()
			,targetHTML = sName+'.html'
			,done = this.async()
			,exec = require('child_process').exec
			,fs = require('fs')
		;
		exec('phantomjs render/render.js '+sUrl, handleExec);

		function handleExec(error, stdout, stderr){
			fs.writeFile('render/'+targetHTML, stdout, handleWriteFile);
		}

		function handleWriteFile(err){
			console.log(err||'file \''+targetHTML+'\' saved');
			done();
		}
	});
};