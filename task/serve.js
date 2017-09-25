/**
 * node task/serve dist 8383
 */

const fs = require('fs')
  ,express    = require('express')
  ,bodyParser = require('body-parser')
  ,serveStatic = require('serve-static')
  ,openBrowser = require('open')
  ,utils = require('./utils')
  ,{read,save,warn} = utils
  ,root = process.argv[2]||'src'
  ,port = process.argv[3]||8183
  ,router = express.Router()
  ,path = require('path')
  //
  ,eventKeys = ['ago','since','year','accuracy','name','exclude','importance','icon','category','tags','wikimediakey','explanation','wikimedia','image','thumb','imagename','imageinfo','wikijson','links','example','remark']
  ,{getWikiMedia,getImageThumb} = require(__dirname+'/wikiUtils')
  ,jsonSrc = './src/static/events.json'
  ,jsonDist = './dist/static/events.json'

express()
    .use(serveStatic('./'+root+'/'))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .get('/api', (req, res)=>res.json({success:true}))
    .get('/api/events', (req, res)=>read(jsonSrc).then(res.json))
    .post('/api/events', onPostEvent)
    .get('/*', (req, res)=>res.sendFile(path.join(__dirname + '/../dist/index.html')))
    .use(bodyParser.json())
    .use('/api', router)
    .listen(port);

/**
 * Post event to save in json
 * @param request
 * @param response
 */
function onPostEvent(request, response){
  const body = request.body
  //
  /*console.log('request'
    ,JSON.stringify(request.params)
    ,JSON.stringify(request.body)
    ,JSON.stringify(request.query)
  ); // todo: remove log*/
  //
  const hasTime = isValidNumber(body.ago)||isValidNumber(body.since)||isValidNumber(body.year)
    ,hasName = isValidString(body.name)
    ,hasWiki = isValidString(body.wikimediakey)
    ,hasImage = isValidString(body.image)
  if (hasTime&&hasName&&hasWiki&&hasImage) {
    //
    const resultEvent = eventKeys.reduce((obj,prop)=>{
      obj[prop] = body[prop]||''
      return obj
    },{})

      ,index = parseInt(body.index,10)
      ,hasWikiMedia = !!body.wikimedia
      ,hasThumb = !!body.thumb
    console.log('hasWikiMedia',hasWikiMedia); // todo: remove log
    console.log('hasThumb',hasThumb); // todo: remove log
    //
    Promise.all([
        hasWikiMedia||getWikiMedia(body.wikimediakey)
          .then(wikimedia=>{
            resultEvent.wikimedia = wikimedia
          },warn)
        ,hasThumb||body.image&&getImageThumb(body.image)
            .then(image=>{
              resultEvent.thumb = image.thumbSrc
              resultEvent.imagename = image.imageName
              resultEvent.imageinfo = image.imageInfo
            })
      ])
      .then(()=>saveJsonEntry(resultEvent,index))
      .then(()=>response.status(200).json(resultEvent),warn)

  } else {
    const errors = []
    hasTime||errors.push('Event has no time.')
    hasName||errors.push('Event has no name.')
    hasWiki||errors.push('Event has no wiki.')
    hasImage||errors.push('Event has no image.')
    response.status(400).json({error:errors.join(' ')})
  }
}

function saveJsonEntry(entry,index){
	read(jsonSrc)
    .then(JSON.parse)
    .then(data=>{
      data[index] = entry
      return Promise.all([
        save(jsonDist,JSON.stringify(data))
        ,save(jsonSrc,JSON.stringify(data))
      ])
    })

}

/**
 * Test if valid number
 * @param {object} number
 * @returns {boolean}
 */
function isValidNumber(number){
	return /^-?\d+$/.test(number)
}

/**
 * Test if valid string
 * @param {object} string
 * @returns {boolean}
 */
function isValidString(string){
	return string!==undefined&&/^.+$/.test(string)
}

openBrowser('http://localhost:'+port);

