/**
 * @namespace totaltimeline.view.header
 */
iddqd.ns('totaltimeline.view.header',(function(){
	'use strict';

	var pages = totaltimeline.pages
		,string = totaltimeline.string
		,emptyElement = totaltimeline.util.emptyElement
		//,log = totaltimeline.view.log
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
		mNav = mView.querySelector('nav');
		mNavUl = mNav.querySelector('ul');
		mSearch = document.getElementById('search');
		mSearchResult = document.getElementById('searchResult');
	}

	function initEvents() {
		pages.loaded.add(handlePagesLoaded);
		mSearch.addEventListener(string.keyup,handleKeyUp);
		mSearch.addEventListener(string.change,handleKeyUp);
		mSearch.addEventListener(string.focus,handleFocusBlur);
		mSearch.addEventListener(string.blur,handleFocusBlur);
	}

	/*function initView() {
	}*/

	// todo: document
	function handlePagesLoaded() {
		emptyElement(mNavUl);
		var mFragment = document.createDocumentFragment();
		for (var i=1,l=pages.length;i<l;i++) { // first page not in menu
			var oPage = pages[i];
			mFragment.appendChild(zen('li>a[href=#'+oPage.slug+']{'+oPage.name+'}').pop());
		}
		mNavUl.appendChild(mFragment);
	}

	// todo: document
	function handleKeyUp(){
		var sSearch = mSearch.value.toLowerCase()
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
		emptyElement(mSearchFragment);
		emptyElement(mSearchResult);
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
		if (e.type===string.focus) {
			mSearchResult.classList.add(string.visible);
		} else {
			setTimeout(function(){
				mSearchResult.classList.remove(string.visible);
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