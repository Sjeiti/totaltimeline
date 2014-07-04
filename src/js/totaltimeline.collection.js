/**
 * 'Abstract' implementation for a collection.
 * @namespace totaltimeline.collection
 */
iddqd.ns('totaltimeline.collection',(function(){
	'use strict';

	var collection = {}
		,sPrefix = 'gsx$'
		,sPropprop = '$t'
	;

	/**
	 * Callback method for the Ajax spreadsheet request.
	 * @callback add~callback
	 * @param {object} sheet The spreadsheet object.
	 * @see https://developers.google.com/gdata/samples/spreadsheet_sample
	 * @see https://developers.google.com/google-apps/spreadsheets/
	 */

	/**
	 * The method that populates the collection.
	 * @callback add~populate
	 * @param {DocumentFragment} fragment The fragment to populate. Fragment itself is added in {@link collectionInstance.populate|the collection instance object}.
	 * @param {totaltimeline.time.range} range The {@link totaltimeline.time.range|time range} to apply.
	 */

	/**
	 * @typedef {Array} collectionInstance
	 * @property {Element} wrapper ...
	 * @property {DocumentFragment} fragment ...
	 * @property {function} populate ...
	 * @property {function} getData ...
	 * @property {function} getProp ...
	 * @property {Signal} dataLoaded ...
	 */

	/**
	 * Adds a new collection type to the timeline.
	 * @name totaltimeline.collection.add
	 * @method
	 * @param {string} slug The name of the collection (will serve as classname in the view).
	 * @param {string} sheetUri The Google spreadsheet uri containing the collection data.
	 * @param {add~callback} callback The callback uri to process the collection data.
	 * @param {add~populate} populate The method that populates the collection.
	 * @return {collectionInstance} Collection instance object.
	 */
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
				,getProp: getProp//todo: can be removed
				,dataLoaded: sgDataLoaded
			})
		;

		mWrapper.classList.add(slug);
		mWrapper.addEventListener(totaltimeline.string.click,function(e){
			var mTarget = e.target
				,oRange = mTarget.range;
			if (oRange) {
				totaltimeline.model.range.set(oRange.start.ago,oRange.end.ago);
			}
		});

		/**
		 * Initialises JSONP call.
		 * @memberof collectionInstance
		 */
		function getData(){
			iddqd.network.jsonp(sheetUri,callback);
		}

		/**
		 * Populates the collection wrapper for a specific {@link totaltimeline.time.range|time range}.
		 * @memberof collectionInstance
		 */
		function populate(view,range){
			emptyView(mWrapper);
			emptyView(mFragment);
			_populate(mFragment,range);
			mWrapper.appendChild(mFragment);//.cloneNode(true)
			if (mWrapper.parentNode!==view) {
				view.appendChild(mWrapper);
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

		collection.push(oReturn);
		return oReturn;
	}

	/**
	 * jhhgg
	 * @name totaltimeline.collection.populate
	 * @param {HTMLElement} view
	 * @param {range} range
	 */
	function populate(view,range) {
		collection.forEach(function(col){
			col.populate(view,range);
		});
	}

	/**
	 * Get a specific property from a spreadsheet enty.
	 * @name totaltimeline.collection.getProp
	 * @param {object} entry
	 * @param {string} prop
	 * @param {boolean} [int]
	 */
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