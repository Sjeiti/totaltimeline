const request = require('request')
  // ,wikitext = require('parse-wikitext')
  ,{read,save} = require(__dirname+'/utils')
  // ,{parseWikitext} = require(__dirname+'/wikiText')
  ,{getWikiMedia,getImageThumb} = require(__dirname+'/wikiUtils')
  ,commander = require('commander').parse(process.argv)
  ,file = commander.args[0]
  // ,file = './src/data/events.json'
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
			if (img&&img.thumbSrc) {
      	event.thumb = img.thumbSrc
				event.imagename = img.imageName
				event.imageinfo = img.imageInfo
			} else if (img&&!img.thumbSrc) {
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

