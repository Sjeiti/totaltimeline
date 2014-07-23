/**
 * @namespace totaltimeline.view.content
 */
iddqd.ns('totaltimeline.view.content',(function(){
	'use strict';

	var /*s = totaltimeline.string
		,collection = totaltimeline.collection
		,*/model
//		,signals = iddqd.signals
		,mContent
		,mFragment = document.createDocumentFragment()
	;

	function init(model){
		initVariables(model);
		initEvents();
		initView();
	}

	/**
	 * Initialise Variables
	 * @param {model} _model
	 */
	function initVariables(_model){
		model = _model;
		mContent = zen('div.content').pop();
		document.getElementById('content').appendChild(mContent);
	}

	/**
	 * Initialise event listeners (and signals).
	 */
	function initEvents(){
		model.entryShown.add(handleEntryShown);
	}

	/**
	 * Initialise view
	 */
	function initView(){
	}

	function handleEntryShown(entry) {
		emptyView(mContent);
		emptyView(mFragment);
		if (entry) {
			mContent.innerHTML = iddqd.tmpl('content_tmpl',iddqd.extend(entry,{
				time: entry.factory===totaltimeline.collection.events.event
						?entry.moment.toString()
						:entry.range.start.toString()+' - '+entry.range.end.toString()
			}));
			/*var mDL = document.createElement('dl');
			for (var s in entry.info) {
				var sDD = entry.info[s]
					,bLink = s==='link'&&sDD!==undefined;
				// todo: multiple links by \n
				zen(bLink
					?'dt{'+s+'}+dd>a[href="'+sDD+'" target=_blank]{'+sDD+'}'
					:'dt{'+s+'}+dd{'+sDD+'}'
				).forEach(mDL.appendChild.bind(mDL));
			}
			mContent.appendChild(mDL);*/
		}
	}

	/**
	 * Removes all children from an HTMLElement.
	 * @param {HTMLElement} element
	 */
	function emptyView(element){
		while (element.childNodes.length) {
			element.removeChild(element.firstChild);
		}
	}

	return iddqd.extend(init,{
//		show: show
	});
})());