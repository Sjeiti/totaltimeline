/**
 * node task/serve dist 8383
 */

const fs = require('fs')
const express    = require('express')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const openBrowser = require('open')
const utils = require('./utils')
const {read,save,warn} = utils
const root = process.argv[2]||'src'
const port = process.argv[3]||8183
const router = express.Router()
const path = require('path')
//
const eventKeys = ['ago','since','year','accuracy','name','exclude','importance','icon','category','tags','wikimediakey','explanation','wikimedia','image','thumb','imagename','imageinfo','wikijson','links','example','remark']
const {getWikiMedia,getImageThumb} = require(__dirname+'/wikiUtils')
const jsonSrc = './src/static/events.json'
const jsonDist = './dist/static/events.json'

express()
    .use(serveStatic('./'+root+'/'))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .get('/api', (req, res)=>res.json({success:true}))
    .get('/api/events', (req, res)=>read(jsonSrc).then(res.json))
    .post('/api/events', onPostEvent)
    .delete('/api/events', onDeleteEvent)
    .get('/*', (req, res)=>res.sendFile(path.join(__dirname + '/../dist/index.html')))
    .use(bodyParser.json())
    .use('/api', router)
    .listen(port);

/**
 * Post event to save in json
 * @param request
 * @param response
 */
function onDeleteEvent(request, response){
  const query = request.query
    ,index = parseInt(query.index,10)
  /*console.log('request'
    ,JSON.stringify(request.params)
    ,JSON.stringify(request.body)
    ,JSON.stringify(request.query)
  );*/ // todo: remove log
	read(jsonSrc)
    .then(JSON.parse)
    .then(data=>{
      if (index>=0&&index<data.length) {
        data.splice(index,1)
      } else {
        throw new Error(`Index ${index} out of bounds`)
      }
      return Promise.all([
        save(jsonDist,JSON.stringify(data))
        ,save(jsonSrc,JSON.stringify(data))
      ])
    })
    .then(
      ()=>response.status(200).json({success:true})
      ,err=>response.status(400).json({error:err})
    )
}

/**
 * Post event to save in json
 * @param request
 * @param response
 */
function onPostEvent(request, response){
  const body = request.body
  const index = parseInt(body.index, 10)
  //
  /*console.log('request'
    ,JSON.stringify(request.params)
    ,JSON.stringify(request.body)
    ,JSON.stringify(request.query)
  );*/ // todo: remove log
  //
  const hasTime = isValidNumber(body.ago)||isValidNumber(body.since)||isValidNumber(body.year)
  const hasName = isValidString(body.name)
  const hasWiki = isValidString(body.wikimediakey)
  const hasImage = isValidString(body.image)
  if (hasTime&&hasName&&hasWiki&&hasImage) {
    //
    const resultEvent = eventKeys.reduce((obj,prop)=>{
        obj[prop] = body[prop]||''
        return obj
      },{})
    const hasWikiMedia = !!body.wikimedia
    const hasThumb = !!body.thumb
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
      if (index>=0&&index<data.length) {
        data[index] = entry
      } else if (index===-1) {
        data.push(entry)
      } else {
        throw new Error(`Index ${index} out of bounds`)
      }
      console.log('saveJsonEntry',index,data?.[index]?.name) // todo: remove log
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

