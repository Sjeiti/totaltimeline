/**
 * todo: document
 * @namespace totaltimeline.pages
 */
iddqd.ns('totaltimeline.pages',(function(undefined){
	'use strict';

	var sgPagesLoaded = new signals.Signal()
		,oReturn = {
			getData: getData
			,length: 0
			,pagesLoaded: sgPagesLoaded
			,getEntryBySlug: getEntryBySlug
		}
	;

	// todo: document
	function getData(model){
		totaltimeline.spreadsheetproxy.getData(model.spreadsheetKey,3,handleGetData);
	}

	// todo: document
	function handleGetData(pages){
		pages.forEach(function(page,i){
			page.slug = totaltimeline.util.slug(page.name);
			//
			//
			/*global markdown*/
			page.explanation = markdown.toHTML(page.copy);
			//
			//
			oReturn[i] = page;
			oReturn.length++;
		});
		sgPagesLoaded.dispatch(oReturn);
	}

	// todo: document
	function getEntryBySlug(slug){
		for (var i=0,l=oReturn.length;i<l;i++) {
			var oPage = oReturn[i]
				,sSlug = oPage.slug;
			if (slug===sSlug) return oPage;
		}
	}

	return oReturn;
})());