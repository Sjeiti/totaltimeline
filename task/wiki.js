const request = require('request')
  ,{read,save,log,promiseRestJSON} = require(__dirname+'/utils')
  ,{parseWikitext} = require(__dirname+'/txtwiki')
  ,file = './temp/events.json'
  //
  ,sEndPointEn = 'http://en.wikipedia.org/w/api.php?'//format=json&action=query&prop=revisions&rvprop=content&titles=
	,sEndPointCommons = 'http://commons.wikimedia.org/w/api.php?'//action=query&prop=revisions&rvprop=content&format=json&titles=File%3AESO-VLT-Laser-phot-33a-07.jpg%7CFile%3AESO-VLT-Laser-phot-33a-07_rsz.jpg%22'
	,oGetVars = {
		format: 'json'
		,action: 'query'
		,prop: 'revisions'
		,rvprop: 'content'
		//,titles
	}

read(file)
  .then(JSON.parse)
	.then(events=>Promise.all([
    events
    ,Promise.all(events.map(({wikimediakey,wikimedia},i)=>{
      //if (i===9) wikimedia = ''
      return wikimediakey&&wikimedia===''
        ?wait(i*300).then(()=>getWikiMedia(wikimediakey))
        :false
    }))
    ,Promise.all(events.map(({image,thumb},i)=>{
      if (i===9) thumb = ''
      return image&&thumb===''
        ?wait(i*300).then(()=>getImageThumb(image))
        :false
    }))
  ]))
  .then(([events,texts,images])=>{
    return events.map((event,i)=>{
      const txt = texts[i]
        ,img = images[i]
      img&&console.log(img)
      //console.log(i,!!txt)
      if (txt) event.wikimedia = txt
      else if (txt==='') console.log('-',event.name)
      return event
    })
  })
  .then(JSON.stringify)
  //.then(data=>save(file,data))

// getWikiMedia('Big Bang')
// getWikiMedia('Origin_of_water_on_Earth#Water_in_the_development_of_Earth')

// getImageThumb('Origin_of_water_on_Earth')
//e.image->e.thumb,e.imagename,e.imageinfo

function wait(millis){
  return new Promise(r=>setTimeout(r,millis))
}

function getWikiJson(url,json=true){
  return new Promise((resolve,reject)=>{
    request({url,json}, (error, response, body)=>{
      if (!error && response.statusCode === 200) {
        resolve(body)
      } else {
        reject(error)
      }
    })
  })
}


/**
 * Get a specific paragraph from a wikimedia article.
 * @param {string} subject The article subject.
 */
function getWikiMedia(subject){
	console.log('getWikiMedia',subject); // todo: remove log
	var sParagraphs = ''
	let p = Promise.resolve(sParagraphs)
	if (subject!=='') {
		var oSubject = splitSubject(subject)
		p = getWikiJson(sEndPointEn+serialize(extend({titles:oSubject.page},oGetVars)))
			// .then(JSON.parse)
			.then(getPageContent)
			.then(content=>parseWikiMedia(content,oSubject.heading,oSubject.paragraphs))
			// ,sJSON = UrlFetchApp.fetch(sEndPointEn+serialize(extend({titles:oSubject.page},oGetVars)))
			// ,sContent = getPageContent(JSON.parse(sJSON))
		//
		// sParagraphs = parseWikiMedia(sContent,oSubject.heading,oSubject.paragraphs)
		// Utilities.sleep(1000)
	}
	return p
}

/**
 * Parses the wiki text and returns specific paragraphs
 * @param {string} content The content.
 * @param {string} heading The heading to search for.
 * @param {array} paragraphs Array of paragraphs to parse.
 */
function parseWikiMedia(content,heading,paragraphs){
	content = content
			.replace(/<!--[^>]*-->/g,'') // remove html comments
			.replace(/<([^\/>]+)>[^<]*<\/([^>]+)>|<([^\/>]+)\/>/g,''); // remove html
	// and a scary while loop to remove nested {{stuff}}
	while(content!==(content=content.replace(/\{\{[^\{\}]*\}\}/gm,''))){}
	var aContent = content
			.split(/\n/g)
			.filter(function(line){
				return !line.match(/^[\s\n\t]*$/) // empty lines
					&&!line.match(/^\s?\[\[[A-Z][a-z]+:/) // File:|Image:|Other: stuff

			})
		,aNewContent = []
		,bHeading = heading!==''

	//console.log('aContent',content,aContent,heading,paragraphs); // log
	for (var i=0,k=aContent.length;i<k;i++) {
		if (!bHeading||aContent[i].match(new RegExp('=\\s?'+heading+'\\s?='))) {
			for (var j=0,l=paragraphs.length;j<l;j++) {
				var iPar = paragraphs[j]
					,sParagraph = parseWikitext(aContent[i+(bHeading?1:0)+iPar])
				aNewContent.push(sParagraph)
			}
			break
		}
	}
	return aNewContent.join('\n')
}

/**
 * Takes a subject and splits it into page, heading and paragraphs
 * @param subject
 * @returns {page:'',heading:'',paragraphs:''}
 */
function splitSubject(subject){
	var oSubject = {}
	if (subject!=='') {
		var aSubject = subject.split(/[:#]/)
			,bHash = subject.indexOf('#')!==-1
			,bPar = subject.indexOf(':')!==-1
			//
			,sSubject = aSubject.shift()
			,sHash = bHash?aSubject.shift().replace(/_/g,' '):''
			,sPar = bPar&&aSubject.shift()
			,aPar = []
			,aTempPar = (sPar?sPar.split(','):['0'])

		aTempPar.forEach(function(s){
			var a = s.split('-')
			if (a.length>1) {
				for (var i=parseInt(a[0],10),l=parseInt(a[1],10);i<=l;i++) {
					aPar.push(i)
				}
			} else {
				aPar.push(parseInt(s,10))
			}
		})
		oSubject.page = sSubject
		oSubject.heading = sHash
		oSubject.paragraphs = aPar
	}
	return oSubject
}

/*function getWikiJSON(subject){
	var sJSON = ''
	if (subject!=='') {
		//return UrlFetchApp.fetch(sEndPointEn+'Pannotia')
		var aSubject = subject.split(/[:#]/)
			,bHash = subject.indexOf('#')!==-1
			,bPar = subject.indexOf(':')!==-1
			//
			,sSubject = aSubject.shift()
			,sHash = bHash&&aSubject.shift().replace('_',' ')
			,sPar = bPar&&aSubject.shift()
			,iPar = sPar&&parseInt(sPar,10)||0

		sJSON = UrlFetchApp.fetch(sEndPointEn+serialize(extend({titles:sSubject},oGetVars)))
	}
	return sJSON
}*/

function getImageThumb(fileName){
	var sThumbnailSource = ''
		,sPageImage = ''
		,sImageInfo = ''
    ,p
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
      ,p = getWikiJson(sUri)
        .then(res=>{
          const oPages = res.query.pages
          for (var s in oPages) {
            if (s!==-1) {
              var oPage = oPages[s]
              sThumbnailSource = oPage.thumbnail.source
              sPageImage = oPage.pageimage
              sImageInfo = getWikiImageInfo(sPageImage)
              break
            }
          }
          return {
            sThumbnailSource
            ,sPageImage
            ,sImageInfo
          }
        })
  }
  return p
		/*	,sJSON = UrlFetchApp.fetch(sUri)
			,oJSON = JSON.parse(sJSON)
			,oPages = oJSON.query.pages

		Utilities.sleep(1000)
		for (var s in oPages) {
          if (s!==-1) {
            var oPage = oPages[s]
			sThumbnailSource = oPage.thumbnail.source
			sPageImage = oPage.pageimage
            sImageInfo = getWikiImageInfo(sPageImage)
			break
          }
		}
	}
  return [[sThumbnailSource,sPageImage,sImageInfo]]
  */
}

/**
 * Get image info
 * @param fileName
 * @returns {string}
 */
async function getWikiImageInfo(fileName) {
	var sText = ''
	if (fileName!=='') {
		//http://commons.wikimedia.org/w/api.php?titles=File%3AESO-VLT-Laser-phot-33a-07.jpg&format=json&action=query&prop=revisions&rvprop=content
		var sUri = sEndPointCommons+serialize(extend({
				titles:'File:'+fileName
			},oGetVars))
	  await sJSON = getWikiJson(sUri)
		sText = getPageContent(JSON.parse(sJSON)).replace(/\n/g,'\r');//txtwiki.parseWikitext(getPageContent(JSON.parse(sJSON)))
	}
	return sText
}

/**
 * Get the content from the wiki json object
 * @param {object} json
 * @returns {string}
 */
function getPageContent(json){
	var sContent = ''
		,oPages = json.query.pages
	for (var s in oPages) {
		var oPage = oPages[s]
		if (oPage&&oPage.revisions) {
			var aRev = oPage.revisions
				,oRev = aRev[0]

			sContent = oRev['*']
			break
		}
	}
	return sContent
}

/**
 * Serialize an object
 * @param {Object} obj Subject.
 */
function serialize(obj) {
	var str = []
	for (var p in obj)
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
		}
	return str.join('&')
}

/**
 * Extend an object
 * @param {Object} obj Subject.
 * @param {Object} fns Property object.
 * @returns {Object} Subject.
 */
function extend(obj,fns){
	for (var s in fns) if (obj[s]===undefined) obj[s] = fns[s]
	return obj
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

