const request = require('request')
  ,{read,save} = require(__dirname+'/utils')
  ,{parseWikitext} = require(__dirname+'/txtwiki')
  ,file = './src/data/events.json'
  // ,file = './src/data/eras.json'
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
		// text
    ,Promise.all(events.map(({wikimediakey,wikimedia},i)=>{
      return wikimediakey&&(wikimedia===''||wikimedia==='Loading...')//&&i===2
        ?wait(i*300).then(()=>getWikiMedia(wikimediakey))
        :false
    }))
		// images
    ,Promise.all(events.map(({image,thumb},i)=>{
      return image&&(thumb===''||thumb==='Loading...')
        ?wait(i*300).then(()=>getImageThumb(image))
        :false
    }))
  ]))
  .then(([events,texts,images])=>{
    return events.map((event,i)=>{
      const txt = texts[i]
        ,img = images[i]
			// texts
      if (txt) event.wikimedia = txt
      else if (txt==='') console.log('-',event.name)
			// images
			if (img&&img.sThumbnailSource) {
      	event.thumb = img.sThumbnailSource
				event.imagename = img.sPageImage
				event.imageinfo = img.sImageInfo
			} else if (img&&!img.sThumbnailSource) {
      	console.warn(`no image for event '${event.name}'`);
			}
      return event
    })
  })
  .then(JSON.stringify)
  .then(data=>save(file,data))

// getWikiMedia('Big Bang')
// getWikiMedia('Origin_of_water_on_Earth#Water_in_the_development_of_Earth')

// getImageThumb('Origin_of_water_on_Earth')
//e.image->e.thumb,e.imagename,e.imageinfo

function wait(millis){
  return new Promise(r=>setTimeout(r,millis))
}

function getWikiJson(url, json=true){
  return new Promise((resolve,reject)=>{
    request({url,json}, (error, response, body)=>{
    	const pages = body&&body.query&&body.query.pages
      if (!error && response.statusCode === 200 && pages) {
        resolve(pages)
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
	let promise = Promise.resolve('')
	if (subject!=='') {
		const subjectSplitted = splitSubject(subject)
		promise = getWikiJson(sEndPointEn+serialize(Object.assign({titles:subjectSplitted.page},oGetVars)))
			.then(getPageContent)
			.then(content=>parseWikiMedia(content,subjectSplitted.heading,subjectSplitted.paragraphs))
	}
	return promise
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
	const aContent = content
			.split(/\n/g)
			.filter(function(line){
				return !line.match(/^[\s\n\t]*$/) // empty lines
					&&!line.match(/^\s?\[\[[A-Z][a-z]+:/) // File:|Image:|Other: stuff
			})
		,newContent = []
		,isHeading = heading!==''
	for (let i=0,k=aContent.length;i<k;i++) {
		if (!isHeading||aContent[i].match(new RegExp('=\\s?'+heading+'\\s?='))) {
			for (let j=0,l=paragraphs.length;j<l;j++) {
				const iPar = paragraphs[j]
					,sParagraph = parseWikitext(aContent[i+(isHeading?1:0)+iPar])
				newContent.push(sParagraph)
			}
			break
		}
	}
	return newContent.join('\n')
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

/**
 *
 * @param {string} fileName
 * @returns {Promise|string}
 * http://en.wikipedia.org/w/api.php?titles=Milky%20Way&prop=pageimages&pithumbsize=320&format=json&action=query
 * http://en.wikipedia.org/w/api.php?titles=ESO-VLT-Laser-phot-33a-07.jpg&prop=pageimages&pithumbsize=320&format=json&action=query
 */
function getImageThumb(fileName){
	let sThumbnailSource = ''
		,sPageImage = ''
		,sImageInfo = ''
    ,promise
	if (fileName!=='') {
		const sUri = sEndPointEn+serialize({
				titles:fileName
				,prop: 'pageimages'
				,pithumbsize: 320
				,format: 'json'
				,action: 'query'
			})
    promise = getWikiJson(sUri)
      .then(result=>{
        for (let id in result) {
          if (id!==-1) {
            const page = result[id]
            sThumbnailSource = page.thumbnail&&page.thumbnail.source
            sPageImage = page.pageimage
            break
          }
        }
        return getWikiImageInfo(sPageImage)
          .then(result=>{
            sImageInfo = result
            return {
              sThumbnailSource
              ,sPageImage
              ,sImageInfo
            }
          })
      })
  }
  return promise
}

/**
 * Get image info
 * @param fileName
 * @returns {string}
 * http://commons.wikimedia.org/w/api.php?titles=File%3AESO-VLT-Laser-phot-33a-07.jpg&format=json&action=query&prop=revisions&rvprop=content
 */
function getWikiImageInfo(fileName) {
	const sUri = sEndPointCommons+serialize(Object.assign({
			titles:'File:'+fileName
		},oGetVars))
	return getWikiJson(sUri)
		.then(getPageContent)
		.then(s=>s.replace(/\n/g,'\r'))
}

/**
 * Get the content from the wiki json object
 * @param {object} result
 * @returns {string}
 */
function getPageContent(result){
	let content = ''
	for (let id in result) {
		const page = result[id]
		if (page&&page.revisions) {
			const revisions = page.revisions
				,revision = revisions[0]
			content = revision['*']
			break
		}
	}
	return content
}

/**
 * Serialize an object
 * @param {Object} obj Subject.
 */
function serialize(obj) {
	let str = []
	for (let p in obj)
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
		}
	return str.join('&')
}

//console.log('sEndPointEn+serialize(Object.assign({titles:sSubject},oGetVars))',sEndPointEn+serialize(Object.assign({titles:'asdf'},oGetVars))); // log
/*

http://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia#How_to_comply_with_a_file.27s_license_requirements

http://en.wikipedia.org/w/api.php?action=query&titles=Milky_Way&prop=pageimages&format=json&pithumbsize=320

http://commons.wikimedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=content&titles=File%3AESO-VLT-Laser-phot-33a-07.jpg%7CFile%3AESO-VLT-Laser-phot-33a-07_rsz.jpg
http://commons.wikimedia.org/w/api.php?action=query&format=json&prop=categories&titles=Image:ESO-VLT-Laser-phot-33a-07.jpg
http://commons.wikimedia.org/w/api.php?action=query&format=json&prop=info%7Cimageinfo&inprop=protection&iiprop=size&titles=File%3AESO-VLT-Laser-phot-33a-07.jpg%7CFile%3AESO-VLT-Laser-phot-33a-07_rsz.jpg
http://commons.wikimedia.org/w/api.php?action=parse&format=json&pst&text=%7B%7BMediaWiki%3AImageAnnotatorTexts%7Clive%3D1%7D%7D&title=API&prop=text&uselang=en&maxage=14400&smaxage=14400
http://commons.wikimedia.org/w/api.php?action=parse&format=json&pst&text=%3Cdiv%20class%3D%22wpImageAnnotatorInlineImageWrapper%22%20style%3D%22display%3Anone%3B%22%3E%3Cspan%20class%3D%22image_annotation_inline_name%22%3EFile%3AESO-VLT-Laser-phot-33a-07_rsz.jpg%3C%2Fspan%3E%7B%7B%3AFile%3AESO-VLT-Laser-phot-33a-07_rsz.jpg%7D%7D%3C%2Fdiv%3E&title=API&prop=text&uselang=en&maxage=1800&smaxage=1800
*/

