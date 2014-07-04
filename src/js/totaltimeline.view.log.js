/**
 * A visual log for mobile browsers
 * @namespace totaltimeline.view.log
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
			mLog.style.position = 'relative';
			mLog.style.top = '2rem';
			mLog.style.margin = '1rem';
			mLog.style.maxHeight = '100%';
			mLog.style.display = 'block';
			mLog.style.backgroundColor = 'yellow';
			mLog.style.border = '1px solid black';
			iddqd.extend(mLog.style,{
				marginTop: '1rem'
				,paddingTop: '1rem'
				,maxHeight: '100%'
				,display: 'block'
				,border: '1px solid black'
				,backgroundColor: '#eee'
			},true);
			document.getElementById('content').appendChild(mLog);
			bInited = true;
			log('mLog.style',mLog.style);
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