/**
 * Try parsing the options to an object
 * @param {string} options
 * @returns {object}
 * @private
 */
export function parseOptions(options) {
  if (isJSONString(options)) {
    options = JSON.parse(options)
  } else if (isObjectString(options)) {
    options = (new Function(`return ${options}`))()
  }
  return options
}


/**
 * Test if string is valid JSON
 * @param {string} str
 * @returns {boolean}
 * @private
 */
export function isJSONString(str='') {
  if ( /^\s*$/.test(str) ) return false
  str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
    .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
  return (/^[\],:{}\s]*$/).test(str)
}

/**
 * Test if string is valid object
 * @param {string} str
 * @returns {boolean}
 * @private
 */
export function isObjectString(str) {
  return /^\s?[\[{]/.test(str)
}

/**
 * Set the innerHTML of a cached div
 * Helper method for getFragment and stringToElement
 * @param {string} str
 * @returns {HTMLDivElement}
 */
function wrapHTMLString(str) {
  const div = wrapHTMLString.div || (wrapHTMLString.div = document.createElement('div'))
  div.innerHTML = str
  return div
}

/**
 * Get documentFragment from an HTML string
 * @param {string} str
 * @returns {DocumentFragment}
 */
export function getFragment(str) {
  const fragment = document.createDocumentFragment()
  Array.from(wrapHTMLString(str).childNodes).forEach(elm => fragment.appendChild(elm))
  return fragment
}

/**
 * Turn an HTML string into an element
 * @param {string} str
 * @returns {HTMLElement}
 */
export function stringToElement(str) {
  return wrapHTMLString(str).childNodes[0]
}

//todo:doc/rename
export function slug(s) {
  return s.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'')
}

export function getPercentage(f){
  return 100*f+'%'
}

export function clearChildren(parent){
  while (parent.firstChild) parent.removeChild(parent.firstChild)
  return parent
}

// todo:document
export function getCssValuePrefix() {
  const aPrefixes = ['', '-o-', '-ms-', '-moz-', '-webkit-']
  const mTmp = document.createElement('div')
  const sValue = 'linear-gradient(left, #fff, #fff)'
  for (let i = 0; i < aPrefixes.length; i++) {
    mTmp.style.backgroundImage = aPrefixes[i] + sValue
    if (mTmp.style.backgroundImage) {
      return aPrefixes[i]
    }
    mTmp.style.backgroundImage = ''
  }
}

export function assignable(arrayProto){
  const keys = Object.getOwnPropertyNames(arrayProto)
  const obj = {}
  keys.forEach(key=>{
    const value = arrayProto[key]
    if (typeof value === 'function') {
      obj[key] = value
    }
  })
  return obj
}

/**
 * Removes all children from an HTMLElement.
 * @param {Node} element
 */
export function emptyNode(element){
  while (element.firstChild) element.removeChild(element.firstChild)
}


export function getMap(min,max) {
  const range = max - min
  return val=>(val-min)/range
}

export function getMinMax(array){
  return array.reduce((minmax,val)=>{
    if (isNaN(val)) val
    else if (val<minmax.min) minmax.min = val
    else if  (val>minmax.max) minmax.max = val
    return minmax
  },{min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY})
}

export default {
  parseOptions
  ,isJSONString
  ,isObjectString
  ,getFragment
  ,stringToElement
  ,slug
  ,getPercentage
  ,clearChildren
  ,getCssValuePrefix
  ,assignable
  ,emptyNode
  ,getMap
  ,getMinMax
}
