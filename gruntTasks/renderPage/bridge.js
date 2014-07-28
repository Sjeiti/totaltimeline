(function (totaltimeline) {
	'use strict';

	// Send messages to the parent PhantomJS process via alert! Good times!!
	function sendMessage() {
		var args = [].slice.call(arguments);
		alert(JSON.stringify(args));
	}

	sendMessage('totaltimeline',totaltimeline);

	totaltimeline.collection.dataLoaded.add(function(collectionInstance) {
		sendMessage('dataLoaded',collectionInstance);
	});

})(totaltimeline);