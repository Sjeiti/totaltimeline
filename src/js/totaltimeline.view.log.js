/**
 * A visual log for mobile browsers
 * @namespace totaltimeline.view.log
 */
iddqd.ns('totaltimeline.view.log',(function(iddqd){
	'use strict';

	var bInited = false
		,aLgg = []
		,oLgg = {}
		,mLog
		,sBr = '<br/>'
	;
	function init(){
		if (!bInited) {
			mLog = zen('pre.log').pop();
			mLog.style.position = 'absolute';
			mLog.style.bottom = '0';
			mLog.style.right = '0';
			mLog.style.height = '50%';
			mLog.style.display = 'block';
			mLog.style.backgroundColor = 'rgba(255,226,0,.8)';
			mLog.style.color = 'black';
			mLog.style.border = '1px solid black';
			mLog.style.overflow = 'auto';
			/*iddqd.extend(mLog.style,{
				marginTop: '1rem'
				,paddingTop: '1rem'
				,maxHeight: '100%'
				,display: 'block'
				,border: '1px solid black'
				,backgroundColor: '#eee'
			},true);*/
			document.getElementById('content').appendChild(mLog);
			bInited = true;
		}
	}
	function log(){
		var s = '';
		for (var i=0,l=arguments.length;i<l;i++) {
			s += arguments[i]+' ';
		}
		/*Array.prototype.forEach.call(arguments,function name(ss) {
			s += ss+' ';
		});*/
		aLgg.unshift(s);
		while (aLgg.length>22) aLgg.pop();
		update();
	}

	/**
	 *
	 * @param key
	 * @param {object} [value...]
	 */
	function watch(key){//,value
		var s = '';
		for (var i=1,l=arguments.length;i<l;i++) {
			s += arguments[i]+' ';
		}
		oLgg[key] = s;
		update();
	}
	function update(){
		init();
		var sLog = '';
		for (var s in oLgg) {
			sLog += s+': '+oLgg[s]+sBr;
		}
		if (sLog!=='') sLog += '-----'+sBr;
		sLog += aLgg.join(sBr);
		mLog.innerHTML = sLog;
	}
	return iddqd.extend(log,{
		watch: watch
	});
})(iddqd));