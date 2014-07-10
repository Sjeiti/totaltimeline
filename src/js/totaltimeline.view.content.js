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
		model.infoShown.add(handleInfoShown);
	}

	/**
	 * Initialise view
	 */
	function initView(){
	}

	function handleInfoShown(info) {
		emptyView(mContent);
		emptyView(mFragment);
		if (info) {
			var mDL = document.createElement('dl');
			for (var s in info) {
				zen('dt{'+s+'}+dd{'+info[s]+'}').forEach(mDL.appendChild.bind(mDL));
			}
			mContent.appendChild(mDL);
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