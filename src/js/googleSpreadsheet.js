/* global UrlFetchApp, Utilities, txtwiki */
'use strict';
getWikiMedia;getImageThumb;

var sEndPointEn = 'http://en.wikipedia.org/w/api.php?'//format=json&action=query&prop=revisions&rvprop=content&titles=
	,sEndPointCommons = 'http://commons.wikimedia.org/w/api.php?'//action=query&prop=revisions&rvprop=content&format=json&titles=File%3AESO-VLT-Laser-phot-33a-07.jpg%7CFile%3AESO-VLT-Laser-phot-33a-07_rsz.jpg%22'
	,oGetVars = {
		format: 'json'
		,action: 'query'
		,prop: 'revisions'
		,rvprop: 'content'
		//,titles
	}
;
/**
 * Get a specific paragraph from a wikimedia article.
 * @param {string} subject The article subject.
 */
function getWikiMedia(subject){
	var sParagraph = '';
	if (subject!=='') {
		//return UrlFetchApp.fetch(sEndPointEn+'Pannotia');
		var aSubject = subject.split(/[:#]/)
			,bHash = subject.indexOf('#')!==-1
			,bPar = subject.indexOf(':')!==-1
			//
			,sSubject = aSubject.shift()
			,sHash = bHash&&aSubject.shift().replace('_',' ')
			,sPar = bPar&&aSubject.shift()
			,iPar = sPar&&parseInt(sPar,10)||0
			,sJSON = UrlFetchApp.fetch(sEndPointEn+serialize(extend({titles:sSubject},oGetVars)))
			,sContent = getPageContent(JSON.parse(sJSON))
				.replace(/<!--[^>]*-->/g,'') // remove html comments
				.replace(/<([^\/>]+)>[^<]*<\/([^>]+)>|<([^\/>]+)\/>/g,'') // remove html
				.replace(/\n^\s*\|[^\n]*/gm,'') // remove | stuff
				.replace(/\{\{[^\{\}]*\}\}/g,'') // remove {{stuff}}
			,aContent = sContent
				.split(/\n/g)
				.filter(function(line){
					return !line.match(/^[\s\n\t]*$/) // empty lines
						&&!line.match(/^\s?\[\[File/) // File stuff
					;
				})
		;
		Utilities.sleep(1000);
		if (bHash) {
			for (var i=0,l=aContent.length;i<l;i++) {
				if (aContent[i].match(new RegExp('=\\s?'+sHash+'\\s?='))) {
					sParagraph = txtwiki.parseWikitext(aContent[i+1+iPar]);
					break;
				}
			}
		} else {
			sParagraph = txtwiki.parseWikitext(aContent[iPar]);
		}
	}
	return sParagraph;
}

function getImageThumb(fileName){
	var sThumbnailSource = ''
		,sPageImage = ''
		,sImageInfo = ''
	;
	if (fileName!=='') {
		//http://en.wikipedia.org/w/api.php?titles=Milky%20Way&prop=pageimages&pithumbsize=320&format=json&action=query
		//http://en.wikipedia.org/w/api.php?titles=ESO-VLT-Laser-phot-33a-07.jpg&prop=pageimages&pithumbsize=320&format=json&action=query
		var sUri = sEndPointEn+serialize({
				titles:fileName
				,prop: 'pageimages'
				,pithumbsize: 320
				,format: 'json'
				,action: 'query'
			})
			,sJSON = UrlFetchApp.fetch(sUri)
			,oJSON = JSON.parse(sJSON)
			,oPages = oJSON.query.pages
		;
		Utilities.sleep(1000);
		for (var s in oPages) {
          if (s!==-1) {
            var oPage = oPages[s];
			sThumbnailSource = oPage.thumbnail.source;
			sPageImage = oPage.pageimage;
            sImageInfo = getWikiImageInfo(sPageImage);
			break;
          }
		}
	}
  return [[sThumbnailSource,sPageImage,sImageInfo]];
}

/**
 * Get image info
 * @param fileName
 * @returns {string}
 */
function getWikiImageInfo(fileName) {
	var sText = '';
	if (fileName!=='') {
		//http://commons.wikimedia.org/w/api.php?titles=File%3AESO-VLT-Laser-phot-33a-07.jpg&format=json&action=query&prop=revisions&rvprop=content
		var sUri = sEndPointCommons+serialize(extend({
				titles:'File:'+fileName
			},oGetVars))
			,sJSON = UrlFetchApp.fetch(sUri)
		;
		Utilities.sleep(1000);
		sText = getPageContent(JSON.parse(sJSON)).replace(/\n/g,'\r');//txtwiki.parseWikitext(getPageContent(JSON.parse(sJSON)));
	}
	return sText;
}

/**
 * Get the content from the wiki json object
 * @param {object} json
 * @returns {string}
 */
function getPageContent(json){
	var sContent = ''
		,oPages = json.query.pages;
	for (var s in oPages) {
		var oPage = oPages[s];
		if (oPage&&oPage.revisions) {
			var aRev = oPage.revisions
				,oRev = aRev[0]
			;
			sContent = oRev['*'];
			break;
		}
	}
	return sContent;
}

/**
 * Serialize an object
 * @param {Object} obj Subject.
 */
function serialize(obj) {
	var str = [];
	for (var p in obj)
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
		}
	return str.join('&');
}

/**
 * Extend an object
 * @param {Object} obj Subject.
 * @param {Object} fns Property object.
 * @returns {Object} Subject.
 */
function extend(obj,fns){
	for (var s in fns) if (obj[s]===undefined) obj[s] = fns[s];
	return obj;
}

//console.log('sEndPointEn+serialize(extend({titles:sSubject},oGetVars))',sEndPointEn+serialize(extend({titles:'asdf'},oGetVars))); // log
/*

http://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia#How_to_comply_with_a_file.27s_license_requirements

http://en.wikipedia.org/w/api.php?action=query&titles=Milky_Way&prop=pageimages&format=json&pithumbsize=320

http://commons.wikimedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=content&titles=File%3AESO-VLT-Laser-phot-33a-07.jpg%7CFile%3AESO-VLT-Laser-phot-33a-07_rsz.jpg
http://commons.wikimedia.org/w/api.php?action=query&format=json&prop=categories&titles=Image:ESO-VLT-Laser-phot-33a-07.jpg
http://commons.wikimedia.org/w/api.php?action=query&format=json&prop=info%7Cimageinfo&inprop=protection&iiprop=size&titles=File%3AESO-VLT-Laser-phot-33a-07.jpg%7CFile%3AESO-VLT-Laser-phot-33a-07_rsz.jpg
http://commons.wikimedia.org/w/api.php?action=parse&format=json&pst&text=%7B%7BMediaWiki%3AImageAnnotatorTexts%7Clive%3D1%7D%7D&title=API&prop=text&uselang=en&maxage=14400&smaxage=14400
http://commons.wikimedia.org/w/api.php?action=parse&format=json&pst&text=%3Cdiv%20class%3D%22wpImageAnnotatorInlineImageWrapper%22%20style%3D%22display%3Anone%3B%22%3E%3Cspan%20class%3D%22image_annotation_inline_name%22%3EFile%3AESO-VLT-Laser-phot-33a-07_rsz.jpg%3C%2Fspan%3E%7B%7B%3AFile%3AESO-VLT-Laser-phot-33a-07_rsz.jpg%7D%7D%3C%2Fdiv%3E&title=API&prop=text&uselang=en&maxage=1800&smaxage=1800
*/