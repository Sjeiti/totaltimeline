/**
 * A collection of {@link collectionInstance}s
 * @namespace totaltimeline.collection
 * @property {number} length
 */
iddqd.ns('totaltimeline.collection',(function(){
	'use strict';

	var collection = {}
		,sPrefix = 'gsx$'
		,sPropprop = '$t'
	;

	/**
	 * Callback method for the Ajax spreadsheet request.
	 * @callback totaltimeline.collection~add-callback
	 * @param {object} sheet The spreadsheet object.
	 * @see https://developers.google.com/gdata/samples/spreadsheet_sample
	 * @see https://developers.google.com/google-apps/spreadsheets/
	 */

	/**
	 * The callback method that populates the collection.
	 * @callback totaltimeline.collection~add-populate
	 * @param {DocumentFragment} fragment The fragment to populate. Fragment itself is added in {@link collectionInstance.populate|the collection instance object}.
	 * @param {totaltimeline.time.range} range The {@link totaltimeline.time.range|time range} to apply.
	 */

	/**
	 * An object instance created by the factory method {@link totaltimeline.collection.add}
	 * @typedef {Array} collectionInstance
	 * @property {Element} wrapper The wrapper element (has the event listeners for the collection instances).
	 * @property {DocumentFragment} fragment A document fragment re-used for populating the wrapper element.
	 * @property {function} populate Populates the view for a specific {@link totaltimeline.time.range|range}.
	 * @property {function} getData Initialises the Ajax call to load the spreadsheet data.
	 * @property {Signal} dataLoaded Signal that fires when the spreadsheet data is loaded.
	 */

	/**
	 * Adds a new collection type to the timeline.
	 * todo: explain click event listener
	 * @name totaltimeline.collection.add
	 * @method
	 * @param {string} slug The name of the collection (will serve as classname in the view).
	 * @param {string} sheetUri The Google spreadsheet uri containing the collection data.
	 * @param {totaltimeline.collection~add-callback} callback The callback uri to process the collection data.
	 * @param {totaltimeline.collection~add-populate} populate The method that populates the collection.
	 * @return {collectionInstance} Collection instance object.
	 */
	function add(slug,sheetUri,callback,_populate){
		sheetUri = sheetUri.replace(/key/,totaltimeline.model.spreadsheetKey);

		var s = totaltimeline.string
			,model = totaltimeline.model
			,aCollection = []
			,mWrapper = document.createElement('div')
			,mFragment = document.createDocumentFragment()
			,sgDataLoaded = new signals.Signal()
			,oReturn = iddqd.extend(aCollection,{
				wrapper: mWrapper
				,fragment: mFragment
				,populate: populate
				,getData: getData
//				,getProp: getProp//todo: can be removed
				,dataLoaded: sgDataLoaded
			})
		;

		mWrapper.classList.add(slug);
		mWrapper.addEventListener(s.click, handleWrapperClick, false);

		/**
		 * Handles the click event on the wrapper.
		 * @param e
		 */
		function handleWrapperClick(e) {
			var mTarget = e.target
				,oModel = mTarget.model;
			oModel&&oModel.info&&model.entryShown.dispatch(oModel);
		}

		/**
		 * Initialises JSONP call.
		 * @memberof collectionInstance
		 */
		function getData(){
//			iddqd.network.jsonp(sheetUri,callback);
			window['_'+slug] = callback;
			iddqd.loadScript('/data/_'+slug+'.js');
		}

		/**
		 * Populates the collection wrapper for a specific {@link totaltimeline.time.range|time range}.
		 * @memberof collectionInstance
		 */
		function populate(view,range){
			// todo: refactor more efficiently: only add/remove what is needed
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
	 * Populates all the collections for a range into a view.
	 * @name totaltimeline.collection.populate
	 * @method
	 * @param {HTMLElement} view
	 * @param {range} range
	 */
	function populate(view,range) {
		collection.forEach(function(collectionInstance){
			collectionInstance.populate(view,range);
		});
	}

	/**
	 * Get a specific property from a spreadsheet entry.
	 * @name totaltimeline.collection.getProp
	 * @method
	 * @param {object} entry
	 * @param {string} prop
	 * @param {boolean} [int] Optional boolean to convert the value to an integer.
	 */
	function getProp(entry,prop,int){
		var sProp = entry[sPrefix+prop]
			,sValue = sProp?sProp[sPropprop]:'';
		(sProp===undefined)&&console.warn(prop,'not present in',entry);
		return int===true?parseInt(sValue,10):sValue;
	}

	return iddqd.extend(collection,{
		length: 0
		/**
		 * @name totaltimeline.collection.splice
		 * @method
		 * @param {Number} [start]
		 * @param {Number} [deleteCount]
		 * @param {...*} [items]
		 * @return {Array}
		 */
		,splice: Array.prototype.splice.bind(collection)
		/**
		 * @name totaltimeline.collection.push
		 * @method
		 * @param {...*} [items]
		 * @return {Number}
		 */
		,push: Array.prototype.push.bind(collection)
		/**
		 * @name totaltimeline.collection.forEach
		 * @method
		 * @param {Function} callback
		 * @param {Object} [thisObject]
		 * @return {void}
		 */
		,forEach: Array.prototype.forEach.bind(collection)
		,add: add
		,getProp: getProp
		,populate: populate
	});
})());