

module.exports = function(grunt) {
'use strict';

	// Nodejs libs.
	var path = require('path');

//	var page = require('webpage').create(),
//		  system = require('system'),
//		  fs = require('fs');

	// External lib.
	var phantomjs = require('grunt-lib-phantomjs').init(grunt);

	// Get an asset file, local to the root of the project.
	var asset = path.join.bind(null, __dirname, '..');

	grunt.registerMultiTask('renderPage', 'Execute cli tasks', function() {

		var url = 'http://localhost.ttl/milky-way';

  		var done = this.async();
//		setTimeout(done,2000);

		var http = require('http'),
		  exec = require('child_process').exec,
		  fs = require('fs');

		exec('phantomjs render/render.js google.com', function(error, stdout, stderr) {
			//console.log(error, stdout, stderr);

			require('fs').writeFile('render/example.html', stdout, function(err) {
				console.log(err||'file saved');
				done();
			});

		});
		return;

/*
		page.open('http://stackoverflow.com/',function (status) {

			var title = page.evaluate(function (s) {
				return document.querySelector(s).innerText;
			},'title');

			console.log(title);
			phantom.exit();

		});
*/

		phantomjs.on('totaltimeline',function(totaltimeline) {
			console.log('totaltimeline',!!totaltimeline); // log
//			console.log('totaltimeline',totaltimeline.collection.dataLoaded.add); // log
//			totaltimeline.collection.dataLoaded.add(function(){
//				console.log('dataLoaded'); // log
//			});
//			console.log('ttl',phantomjs.evaluate(function(){return document.querySelector('title').innerText;}));
		});
		phantomjs.on('dataLoaded',function(e) {
			console.log('dataLoaded',e); // log
		});
//		phantomjs.on('dataLoaded.add',function(e) {
//			console.log('dataLoaded.add',e); // log
//		});
		phantomjs.spawn(url,{
			// Additional PhantomJS options.
			options: {
				page:{}
				,inject: asset('gruntTasks/renderPage/bridge.js')
			},
			// Do stuff when done.
			done: function (err) {
				console.log('done',arguments); // log
				if (err) { // If there was an error, abort the series.
					done();
				} else { // Otherwise, process next url.
					next();
				}
			}
		});

		page.onLoadFinished = function() {
			console.log('page.onLoadFinished',page.onLoadFinished); // log
		};
		page.open('http://localhost.ttl/milky-way');


//		var webPage = require('webpage');
//		var page = webPage.create();
//		page.open(url,function (status) {
//
//			var title = page.evaluate(function () {
//				return document.title;
//			});
//
//			console.log(title);
//			phantom.exit();
//
//		});
	});
};