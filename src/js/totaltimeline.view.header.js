/**
 * @namespace totaltimeline.view.header
 */
iddqd.ns('totaltimeline.view.header',(function(){
	'use strict';

	var pages = totaltimeline.pages
//		,log = totaltimeline.view.log
		,mView
		,mNav
		,mNavUl
	;

	function init(model) {
		initVariables();
		initEvents(model);
		initView(model);
	}

	function initVariables() {
		mView = document.getElementById('pageHeader');
		mNav = mView.querySelector('nav');
		mNavUl = mNav.querySelector('ul');
	}

	function initEvents() {
		pages.loaded.add(handlePagesLoaded);
	}

	function initView() {
	}

	function handlePagesLoaded() {
		mNavUl.innerHTML = ''; // todo: refactor
		var mFragment = document.createDocumentFragment();
		for (var i=0,l=pages.length;i<l;i++) {
			var oPage = pages[i];
			mFragment.appendChild(zen('li>a[href=#'+oPage.slug+']{'+oPage.name+'}').pop());
		}
		mNavUl.appendChild(mFragment);
	}

	return init;
})());