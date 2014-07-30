/**
 * @namespace totaltimeline.view.content
 */
iddqd.ns('totaltimeline.view.content',(function(){
	'use strict';

	var mContent
		,mContentWrapper
		,mFragment = document.createDocumentFragment()
	;

	function init(model){
		initVariables();
		if (mContent) {
			initEvents(model);
			initView();
		}
	}

	/**
	 * Initialise Variables
	 */
	function initVariables(){
		mContent = document.getElementById('content');
		mContentWrapper = zen('div.content').pop();
	}

	/**
	 * Initialise event listeners (and signals).
	 * @param {model} model
	 */
	function initEvents(model){
		model.entryShown.add(handleEntryShown);
	}

	/**
	 * Initialise view
	 */
	function initView(){
		mContent.appendChild(mContentWrapper);
	}

	// todo:document
	function handleEntryShown(entry) {
		//console.log('handleEntryShown',Date.now(),entry&&entry.info.name,entry); // log
		//totaltimeline.view.log('handleEntryShown',entry.info.name);
		init.currentEntry = entry;
		emptyView(mContentWrapper);
		emptyView(mFragment);
		if (entry) {
			mContentWrapper.innerHTML = iddqd.tmpl('content_tmpl',iddqd.extend(entry,{
				time: entry.factory===totaltimeline.collection.events.event
						?entry.moment.toString()
						:entry.range.start.toString()+' - '+entry.range.end.toString()
			}));
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

	return init;//iddqd.extend(init,{show: show});
})());