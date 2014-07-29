/*global phantom*/
(function(page){
	'use strict';
	var system = require('system')
		,args = system.args
		,sSrcUri = args[1]
		,sName = sSrcUri.split('/').pop()
	;

	page.viewportSize = { width: 800, height: 600 };
	page.onLoadFinished = handleLoadFinished;
	page.open(sSrcUri);

	function handleLoadFinished(){
		waitFor(waitForCondition,waitForDone);
	}

	function waitForCondition(){
		return page.evaluate(function () {
			var c = window.totaltimeline.collection;
			return c.length===c.loaded;
		});
	}

	function waitForDone(){
		//console.log(page.title);
		//console.log(page.evaluate(function(){return document.querySelector('title').innerText;}));
		page.render('render/'+sName+'.png');

		var sHtml = page.evaluate(function() {
			return document.getElementsByTagName('html')[0].innerHTML;
		});
		/*require('fs').writeFile('render/example.html', sHtml, function(err) {
			console.log(err||'file saved');
			phantom.exit();
		});*/

		//require('fs').write('render/example.html', sHtml, 'w');

		console.log(sHtml); // log
		//	var system = require('system');
		//	var args = system.args;
		//			console.log(JSON.stringify(args)); // log

		phantom.exit(sHtml);
	}

	/**
	 * Wait until the test condition is true or a timeout occurs. Useful for waiting
	 * on a server response or for a ui change (fadeIn, etc.) to occur.
	 *
	 * @param testFx javascript condition that evaluates to a boolean,
	 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
	 * as a callback function.
	 * @param onReady what to do when testFx condition is fulfilled,
	 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
	 * as a callback function.
	 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
	 */
	function waitFor(testFx, onReady, timeOutMillis) {
		var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
			start = new Date().getTime(),
			condition = false,
			interval = setInterval(function() {
				if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
					// If not time-out yet and condition not yet fulfilled
					condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
				} else {
					if(!condition) {
						// If condition still not fulfilled (timeout but condition is 'false')
						console.log("'waitFor()' timeout");
						phantom.exit(1);
					} else {
						// Condition fulfilled (timeout and/or condition is 'true')
//						console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
						typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
						clearInterval(interval); //< Stop this interval
					}
				}
			}, 250); //< repeat check every 250ms
	}

})(require('webpage').create());

