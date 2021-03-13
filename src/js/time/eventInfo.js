/**
 * An object instance created by the factory method {@link totaltimeline.time.eventInfo}
 * @typedef {object} eventInfo
 * @property {string} name
 * @property {string} slug
 * @property {string} icon
 * @property {string} importance
 * @property {string} accuracy
 *
 * @property {string} explanation
 * @property {string} wikimediakey
 * @property {string} wikimedia
 *
 * @property {string} image
 * @property {string} thumb
 * @property {string} imagename
 * @property {string} imageinfo
 *
 * @property {string} example
 * @property {string} links
 * @property {string} remark
 *
 * @property {function} parse
 */
/**
 * Factory method for creating an eventInfo object.
 * @name totaltimeline.time.eventInfo
 * @method
 * @param {object} objectToParse
 * @returns {eventInfo}
 */
import {slug} from '../util'

export default function eventInfo(objectToParse){
  const writable = true
  const inst = Object.seal(Object.create({
    parse(o) {
      // todo: markdown.toHTML(explanation)
      for (var s in o) {
        if (this.hasOwnProperty(s)) {
          this[s] = o[s]
          if (s==='name') {
            this.slug = slug(o[s])
          } else if (s==='tags') {
            this.tags = o[s].split(',').map(function(s){return s.replace(/^\s*|\s*$/g,'')}).filter(function(s){return !s.match(/^[\s\n\t]*$/)})
          }
        }
      }
      return this
    }
    ,toString(){return `[object EventInfo '${this.name}']`}
  },{
    name: {writable}
    ,slug: {writable}
    ,icon: {writable}
    ,importance: {writable}
    ,accuracy: {writable}
    ,tags: {writable,value:[]}

    ,explanation: {writable}
    ,wikimediakey: {writable}
    ,wikimedia: {writable}

    ,image: {writable}
    ,thumb: {writable}
    ,imagename: {writable}
    ,imageinfo: {writable}

    ,example: {writable}
    ,links: {writable}
    ,remark: {writable}
  }))
  return objectToParse?inst.parse(objectToParse):inst
}
