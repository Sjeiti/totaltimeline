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

export function getFragment(str){
  const fragment = document.createDocumentFragment()
  const div = document.createElement('div')
  div.innerHTML = str
  Array.from(div.childNodes).forEach(elm=>fragment.appendChild(elm))
  return fragment
}

//todo:doc/rename
export function slug(s) {
  return s.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
}

export default {
  parseOptions
  ,isJSONString
  ,isObjectString
  ,getFragment
  ,slug
}
