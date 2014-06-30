/**
 * 'Abstract' implementation for a collection.
 * @name collection
 * @namespace totaltimeline
 */
iddqd.ns('totaltimeline.collection',(function(){
	'use strict';

	var collection = {}
		,sPrefix = 'gsx$'
		,sPropprop = '$t'
	;

	function add(slug,sheetUri,callback,_populate){
		sheetUri = sheetUri.replace(/key/,totaltimeline.model.spreadsheetKey);

		var aCollection = []
			,mWrapper = document.createElement('div')
			,mFragment = document.createDocumentFragment()
			,sgDataLoaded = new signals.Signal()
			,oReturn = iddqd.extend(aCollection,{
				wrapper: mWrapper
				,fragment: mFragment
				,populate: populate
				,getData: getData
				,getProp: getProp
				,dataLoaded: sgDataLoaded
			})
		;

		mWrapper.classList.add(slug);

		function getData(){
			iddqd.network.jsonp(sheetUri,callback);
		}

		function populate(view,range){
			emptyView(mWrapper);
			emptyView(mFragment);
			_populate(mFragment,range);
			mWrapper.appendChild(mFragment.cloneNode(true));
			if (mWrapper.parentNode!==view) {
				view.appendChild(mWrapper);
			}
		}

		function emptyView(view){
			while (view.childNodes.length) {
				view.removeChild(view.firstChild);
			}
		}

		collection.push(oReturn);

		return oReturn;
	}

	function getProp(entry,prop,int){
		var sProp = entry[sPrefix+prop]
			,sValue = sProp?sProp[sPropprop]:'';
		(sProp===undefined)&&console.warn(prop+' not present');
		return int===true?parseInt(sValue,10):sValue;
	}

	return iddqd.extend(collection,{
		length: 0
		,splice: Array.prototype.splice.bind(collection)
		,push: Array.prototype.push.bind(collection)
		,forEach: Array.prototype.forEach.bind(collection)
		,add: add
		,getProp: getProp
	});
})());