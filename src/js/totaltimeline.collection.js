/**
 * A collection of {@link collectionInstance}s
 * @namespace totaltimeline.collection
 * @property {number} length
 */
iddqd.ns('totaltimeline.collection',(function(){
	'use strict';

	var sgCollectionDataLoaded = new signals.Signal()
		//
		,aReferenceItem = []
		,aReferenceSlug = []
		,aReferenceName = []
		//
		,collection = {
			length: 0
			,loaded: 0
			,dataLoaded: sgCollectionDataLoaded
			,add: add
			,populate: populate
			,getEntryBySlug: getEntryBySlug
		}
	;
	sgCollectionDataLoaded.add(handleCollectionDataLoaded);

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
	function add(slug,worksheet,callback,_populate){
//		sheetUri = sheetUri.replace(/key/,totaltimeline.model.spreadsheetKey);

		var string = totaltimeline.string
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
				,dataLoaded: sgDataLoaded
			})
		;

		mWrapper.classList.add(slug);
		mWrapper.addEventListener(string.click, handleWrapperClick, false);

		collection.push(oReturn);
		sgDataLoaded.add(handleDataLoaded,null,-1); // should be the last to called

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
		 * Handles sgDataLoaded signal. At this point the collection instance has finished processing the loaded data.
		 * @param collectionInstance
		 */
		function handleDataLoaded(collectionInstance){
			for (var i=0,l=collectionInstance.length;i<l;i++) {
				var oItem = collectionInstance[i]
					,oInfo = oItem.info;
				aReferenceItem.push(oItem);
				aReferenceSlug.push(oInfo.slug);
				aReferenceName.push(oInfo.name);
			}
			//
			collection.loaded++;
			sgCollectionDataLoaded.dispatch(collectionInstance);
		}


		/**
		 * Initialises JSONP call.
		 * @memberof collectionInstance
		 */
		function getData(){
//			iddqd.network.jsonp(sheetUri,callback);
			if (worksheet>0===false) {
				callback&&callback();
			} else if (callback) {
				totaltimeline.spreadsheetproxy.getData(
					totaltimeline.model.spreadsheetKey
					,worksheet
					,callback
				);
			}
//			window['_'+slug] = callback;
//			iddqd.loadScript('/data/_'+slug+'.js');
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
		function emptyView(element){ // todo: move to utils
			while (element.childNodes.length) {
				element.removeChild(element.firstChild);
			}
		}

		return oReturn;
	}

	/**
	 * All data is loaded so we now cross-reference text with anchors.
	 * todo: refactor more effeciently
	 * todo: replace strings more accurately (spaces and points)
	 */
	function handleCollectionDataLoaded(){
		for (var i=0,l=aReferenceItem.length;i<l;i++) {
			var oItem = aReferenceItem[i]
				,oInfo = oItem.info
				,sCopy = oInfo.wikimedia
			;
			if (sCopy) {
				for (var m=0,n=aReferenceSlug.length;m<n;m++) {
					var sSlug = aReferenceSlug[m]
						,sName = aReferenceName[m]
						,rxMatch = new RegExp('([\\s]('+sName+')[^a-z])','i')
						//,rxMatch = new RegExp('([\\s]('+sName+')[\\s\\.,])','gi')
						,aMatch = sCopy.match(rxMatch)
					;
					if (sSlug!==oInfo.slug&&aMatch) {
						sCopy = sCopy.replace(rxMatch,'<a href="#'+sSlug+'">$1</a>');
					}
					oInfo.wikimedia = sCopy;
				}
			}
		}
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

	// todo: document
	// todo: check name: is it entry or item or what
	function getEntryBySlug(_slug){
		var oEntry
			,iIndex = aReferenceSlug.indexOf(_slug);
		if (iIndex!==-1) {
			oEntry = aReferenceItem[iIndex];
		}
		return oEntry;
	}

	return iddqd.extend(collection,{
		/**
		 * @name totaltimeline.collection.splice
		 * @method
		 * @param {Number} [start]
		 * @param {Number} [deleteCount]
		 * @param {...*} [items]
		 * @return {Array}
		 */
		splice: Array.prototype.splice.bind(collection)
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
	});
})());