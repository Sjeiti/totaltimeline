/**
 * @namespace totaltimeline.view.content
 */
iddqd.ns('totaltimeline.view.content',(function(){
	'use strict';

	var collection = totaltimeline.collection
		,event = collection.events.event
		,period = collection.periods.period
		,mContent
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
			var sTime = '';
			if (entry.factory===event) {
				sTime = entry.moment.toString();
			} else if (entry.factory===period) {
				sTime = entry.range.start.toString()+' - '+entry.range.end.toString();
			}
			mContentWrapper.innerHTML = iddqd.tmpl('content_tmpl',iddqd.extend(entry,{
				time: sTime
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