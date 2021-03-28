// const request = require('request')
const {parseWikitext} = require(__dirname+'/wikiText')
const sEndPointEn = 'http://en.wikipedia.org/w/api.php?'//format=json&action=query&prop=revisions&rvprop=content&titles=
const sEndPointCommons = 'http://commons.wikimedia.org/w/api.php?'//action=query&prop=revisions&rvprop=content&format=json&titles=File%3AESO-VLT-Laser-phot-33a-07.jpg%7CFile%3AESO-VLT-Laser-phot-33a-07_rsz.jpg%22'
const oGetVars = {
		format: 'json'
		,action: 'query'
		,prop: 'revisions'
		,rvprop: 'content'
		//,titles
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
  console.log('parseWikiMedia',{content,heading,paragraphs}); // todo: remove log
	content = content
			.replace(/<!--[^>]*-->/g,'') // remove html comments
			.replace(/<([^\/>]+)>[^<]*<\/([^>]+)>|<([^\/>]+)\/>/g,''); // remove html
			// .replace(/<[^>]+>/g,''); // remove html
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
  // console.log('parseWikiMedia',{content,heading,paragraphs},newContent.join('\n')); // todo: remove log
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
	let thumbSrc = ''
		,imageName = ''
		,imageInfo = ''
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
      	console.log('result',result); // todo: remove log
        for (let id in result) {
          if (id!==-1) {
            const page = result[id]
            thumbSrc = page.thumbnail&&page.thumbnail.source
            imageName = page.pageimage
            break
          }
        }
        return getWikiImageInfo(imageName)
          .then(result=>{
            imageInfo = result
            return {
              thumbSrc
              ,imageName
              ,imageInfo
            }
          })
      })
  }
  return promise
}

function getWikiJson(url, json=true){
  const fetch = require('node-fetch')
  return fetch(url).then(response=>response.json())
  /*return new Promise((resolve,reject)=>{
    request({url,json}, (error, response, body)=>{
    	const pages = body&&body.query&&body.query.pages
      if (!error && response.statusCode === 200 && pages) {
        resolve(pages)
      } else {
        reject(error)
      }
    })
  })*/
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
		.then(s=>{
			// hack and slash the image info wikitext, we only need it for search anyway
			// console.log('s',s); // todo: remove log
			return (s.match(/(:en:.*(]]))|(en=.*)|(en\|.*)/g)||[])
				.map(s=>s.replace(/(:en:|en=|en\||[\[\]{}|])/g,' '))
				.join(' ').split(/\s+/g)
				.reduce((a,b)=>(a.includes(b)||a.push(b),a),[])
				.filter(s=>!['','.','of','the','and','in','<br>','on','is','by','to','the','of','a'].includes(s))
				.join(' ')
		})
		// .then(s=>s.replace(/\n/g,'\r'))
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

module.exports = {
  getWikiMedia
  ,parseWikiMedia
  ,getImageThumb
};