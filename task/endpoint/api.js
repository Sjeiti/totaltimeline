module.exports = {
  api: require('express').Router()
    .get('/', getApi)

    .get('/events', getEvents)
    .post('/events', onPostEvent)
    .delete('/events', onDeleteEvent)

    .get('/events/importance', onSetImportance)

    .get('/wikimedia', onGetWiki)
    .get('/wikimedia/:page?/:section?/:index?', onGetWiki)
}

//

const {JSDOM} = require('jsdom')

const {read, save, warn} = require('../utils')

const eventKeys = ['ago', 'since', 'year', 'accuracy', 'name', 'exclude', 'importance', 'icon', 'category', 'tags', 'wikimediakey', 'explanation', 'wikimedia', 'image', 'thumb', 'imagename', 'imageinfo', 'wikijson', 'links', 'example', 'remark']
const {getWikiMedia, getImageThumb} = require(__dirname + '/../wikiUtils')
const jsonSrc = './src/static/events.json'
const jsonDist = './dist/static/events.json'

const err = res=>(a)=>res.json({error: true,a})

//

function getApi(req, res) {
  res.json({success: true})
}


function getEvents(req, res){
  return read(jsonSrc)
    .then(s=>res.json(JSON.parse(s)))
    .catch(err(res))
}


/**
 * Post event to save in json
 * @param request
 * @param response
 */
function onDeleteEvent(request, response) {
  const query = request.query
  const index = parseInt(query.index, 10)
  /*console.log('request'
    ,JSON.stringify(request.params)
    ,JSON.stringify(request.body)
    ,JSON.stringify(request.query)
  );*/ // todo: remove log
  read(jsonSrc)
    .then(JSON.parse)
    .then(data => {
      if (index >= 0 && index < data.length) {
        data.splice(index, 1)
      } else {
        throw new Error(`Index ${index} out of bounds`)
      }
      return Promise.all([
        save(jsonDist, JSON.stringify(data))
        , save(jsonSrc, JSON.stringify(data))
      ])
    })
    .then(
      () => response.status(200).json({success: true})
      , err => response.status(400).json({error: err})
    )
}

/**
 * Result event
 * @typedef {object} ResultEvent
 * @param {string} wikimedia -
 * @param {string} thumb -
 * @param {string} imagename -
 * @param {string} imageinfo -
 */

/**
 * Post event to save in json
 * @param request
 * @param response
 */
function onPostEvent(request, response) {
  const body = request.body
  const index = parseInt(body.index, 10)
  //
  /*console.log('request'
    ,JSON.stringify(request.params)
    ,JSON.stringify(request.body)
    ,JSON.stringify(request.query)
  );*/ // todo: remove log
  //
  const hasTime = isValidNumber(body.ago) || isValidNumber(body.since) || isValidNumber(body.year)
  const hasName = isValidString(body.name)
  const hasWiki = isValidString(body.wikimediakey)
  const hasImage = isValidString(body.image)
  if (hasTime && hasName && hasWiki && hasImage) {
    const resultEvent = eventKeys.reduce((obj, prop) => {
      obj[prop] = body[prop] || ''
      return obj
    }, {})
    const hasWikiMedia = !!body.wikimedia
    const hasThumb = !!body.thumb
    //
    Promise.all([
      hasWikiMedia || getWikiMedia(body.wikimediakey)
        .then(wikimedia => {
          resultEvent.wikimedia = wikimedia
        }, warn)
      , hasThumb || body.image && getImageThumb(body.image)
        .then(image => {
          resultEvent.thumb = image.thumbSrc
          resultEvent.imagename = image.imageName
          resultEvent.imageinfo = image.imageInfo
        })
    ])
      .then(() => saveJsonEntry(resultEvent, index))
      .then(() => response.status(200).json(resultEvent), warn)

  } else {
    const errors = []
    hasTime || errors.push('Event has no time.')
    hasName || errors.push('Event has no name.')
    hasWiki || errors.push('Event has no wiki.')
    hasImage || errors.push('Event has no image.')
    response.status(400).json({error: errors.join(' ')})
  }
}

function saveJsonEntry(entry, index) {
  read(jsonSrc)
    .then(JSON.parse)
    .then(data => {
      if (index >= 0 && index < data.length) {
        data[index] = entry
      } else if (index === -1) {
        data.push(entry)
      } else {
        throw new Error(`Index ${index} out of bounds`)
      }
      console.log('saveJsonEntry', index, data?.[index]?.name) // todo: remove log
      //
      cleanEvents(data)
      sortEvents(data)
      //
      return saveSrcAndDist(data)
    })
}

function cleanEvents(events) {
  events.forEach(evt => {
    ['since', 'ago', 'year', 'importance'].forEach(prop=>numberProp(evt, prop))
    // evt.ago?.length > 0 && (evt.ago = parseFloat(evt.ago))
    // evt.year?.length > 0 && (evt.year = parseFloat(evt.year))
    // evt.since?.length > 0 && (evt.since = parseFloat(evt.since))
  })
  return events
}

function sortEvents(events) {
  events.sort((a, b) => {
    const a_ago = getAgo(a)
    const b_ago = getAgo(b)
    return a_ago === b_ago ? 0 : (a_ago > b_ago ? -1 : 1)
  })
  return events
}

function saveSrcAndDist(data){
  return Promise.all([
    save(jsonDist, JSON.stringify(data))
    , save(jsonSrc, JSON.stringify(data))
  ])
}

function onSetImportance(req, res){
  read(jsonSrc)
    .then(JSON.parse)
    .then(data => {
      calculateImportance(data)
      saveSrcAndDist(data)
      res.json(data)
    })
}
function calculateImportance(events) {
  for (let i=1,l=events.length-1;i<l;i++) {
    const event = events[i]
    const eventP = events[i-1]
    const eventN = events[i+1]
    const timeframe = getAgo(eventP) - getAgo(eventN)
    event.importance = timeframe // / 13798000000
  }
}

// const domutils = require('domutils')
// console.log('domutils',domutils) // todo: remove log

async function onGetWiki(req,res){
  const {page, section, index} = req.params
  console.log('onGetWiki', page, ':', section, ':', index)
  try {
    const response = await fetch('http://en.wikipedia.org/w/api.php?action=parse&format=json&page='+page)
    const responseJSON = await response.json()
    const {parse:{sections:_sections, text:{'*':body}}} = responseJSON
    const sections = _sections.map(section=>section.linkAnchor)

    const dom = new JSDOM(`<!DOCTYPE html>${body}`)
    const {window: {document}} = dom

    const firstParagraph = document.querySelector('.mw-parser-output>p')
    // const ids = Array.from(document.querySelectorAll('[id]'))
    //   .map(elm=>elm.getAttribute('id'))
    //   .filter(id=>!/^cite/i.test(id))
    //   .join('\n')
    // console.log('ids',ids) // todo: remove log

    // (h3>span#section)+div+p+p ...
    const {parentNode} = document.querySelector(`[id="${section}"]`)||{}
    const paragraphsFrom = parentNode||firstParagraph
    const paragraphsAll = paragraphsFrom&&nextQuerySelector(paragraphsFrom, ':not(h3)')
      .filter(elm=>elm.matches('p'))
      .map(elm=>{
        elm.querySelectorAll('.reference').forEach(ref=>ref.remove())
        return elm.textContent
      })
      ||[]

    const paragraphs = index===undefined?paragraphsAll:index
      .split(/,/g)
      .map(s=>paragraphsAll[parseInt(s,10)])

    res.json({
      sections
      , paragraphs
    })
  } catch (error) {
    console.error('error',error)
    res.json({error})
  }
}

function nextQuerySelector(subject, query, result=[]){
  const next = subject.nextElementSibling
  next?.matches(query)
    &&result.push(next)
    &&nextQuerySelector(next, query, result)
  return result
}

function getAgo(event){
  return event.ago !== '' ? event.ago : 2021 - event.year
}

function numberProp(obj, prop){
  const objProp = obj[prop]
  // parseInt fails for exponential values, ie 2E4 becomes 2
  objProp && objProp?.length > 0 && (obj[prop] = parseFloat(objProp))
}

/**
 * Test if valid number
 * @param {object} number
 * @returns {boolean}
 */
function isValidNumber(number) {
  const parsed = parseFloat(number)
  const isNumber = !isNaN(parsed)
  return isNumber&&parsed.toString()===number
}

/**
 * Test if valid string
 * @param {object} string
 * @returns {boolean}
 */
function isValidString(string) {
  return string !== undefined && /^.+$/.test(string)
}


