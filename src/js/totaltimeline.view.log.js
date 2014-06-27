/**
 * A visual log for mobile browsers
 * @name log
 * @namespace totaltimeline.view
 */
iddqd.ns('totaltimeline.view.log',(function(){
	'use strict';

	var bInited = false
		,aLgg = []
		,mLog
	;
	function init(){
		if (!bInited) {
			mLog = zen('pre.log{lgggg}').pop();
			document.getElementById('content').appendChild(mLog);
			mLog.style.marginTop = '1rem';
			mLog.style.paddingTop = '1rem';
			bInited = true;
		}
	}
	function log(){
		init();
		var s = '';
		Array.prototype.forEach.call(arguments,function name(ss) {
			s += ss+' ';
		});
		aLgg.unshift(s);
		while (aLgg.length>22) aLgg.pop();
		mLog.innerHTML = aLgg.join('<br/>');
	}
	return log;
})());