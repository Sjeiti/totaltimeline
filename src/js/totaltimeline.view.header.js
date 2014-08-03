/**
 * @namespace totaltimeline.view.header
 */
iddqd.ns('totaltimeline.view.header',(function(){
	'use strict';

	var pages = totaltimeline.pages
		,util = totaltimeline.util
//		,log = totaltimeline.view.log
		,mView
		,mNav
		,mNavUl
		,mSearch
		,mSearchResult
		,mSearchFragment = document.createDocumentFragment()
	;

	function init() {
		initVariables();
		initEvents();
		//initView();
	}

	function initVariables() {
		mView = document.getElementById('pageHeader');
		if (mView) {// todo: refactor test
			mNav = mView.querySelector('nav');
			mNavUl = mNav.querySelector('ul');
			mSearch = document.getElementById('search');
			mSearchResult = document.getElementById('searchResult');
		}
	}

	function initEvents() {
		if (mView) {// todo: refactor test
			pages.loaded.add(handlePagesLoaded);
			mSearch.addEventListener('keyup',handleKeyUp);
			mSearch.addEventListener('focus',handleFocusBlur);
			mSearch.addEventListener('blur',handleFocusBlur);
		}
	}

	/*function initView() {
	}*/

	// todo: document
	function handlePagesLoaded() {
		mNavUl.innerHTML = ''; // todo: refactor
		var mFragment = document.createDocumentFragment();
		for (var i=0,l=pages.length;i<l;i++) {
			var oPage = pages[i];
			mFragment.appendChild(zen('li>a[href=#'+oPage.slug+']{'+oPage.name+'}').pop());
		}
		mNavUl.appendChild(mFragment);
	}

	// todo: document
	function handleKeyUp(){
		var sSearch = mSearch.value.toLocaleLowerCase()
			,aFound = []
			,collection = totaltimeline.collection
			,pages = totaltimeline.pages
			,i,l
			,sText,iResult
		;
		l = collection.length;
		for (i=0;i<l;i++) {
			var aInst = collection[i];
			for (var j=0,m=aInst.length;j<m;j++) {
				var oItem = aInst[j];
				sText = oItem.info.name+' '+oItem.info.explanation+' '+oItem.info.wikimedia;
				iResult = searchString(sSearch,sText);
				if (iResult!==0) {
					aFound.push([iResult,oItem]);
				}
			}
		}
		l = pages.length;
		for (i=0;i<l;i++) {
			var oPage = pages[i];
			sText = oPage.name+' '+oPage.copy;
			iResult = searchString(sSearch,sText);
			if (iResult!==0) {
				aFound.push([iResult,oPage]);
			}
		}
		util.emptyElement(mSearchFragment);
		util.emptyElement(mSearchResult);
		aFound.sort(function(a,b){
			return a[0]>b[0]?-1:1;
		});
		l = aFound.length;
		for (i=0;i<l;i++) {
			var oFind = aFound[i][1]
				,oInfo = oFind.info||oFind;
			mSearchResult.appendChild(zen('li>a[href=#'+oInfo.slug+']{'+oInfo.name+'}').pop());
		}
		mSearchResult.appendChild(mSearchFragment);
	}

	// todo: document
	function handleFocusBlur(e){
		if (e.type==='focus') {
			mSearchResult.style.display = 'block';
		} else {
			setTimeout(function(){
				mSearchResult.style.display = 'none';
			},400);
		}
	}

	// todo: document
	function searchString(needle,haystack){
		var aHaystack = haystack.toLocaleLowerCase().split(needle)
			,iHaystack = aHaystack.length
			,iValue = 0;
		if (iHaystack>1) {
			iValue = iHaystack/(aHaystack[0].length+1);
		}
		return iValue;
	}

	return init;
})());