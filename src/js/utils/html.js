/**
 * Append an element to another one
 * @param {HTMLElement} parent
 * @param {string} nodeName
 * @param {string} content
 * @param {object} attrs
 * @returns {HTMLDivElement}
 */
import {emmetExpand} from './emmet'

export const className = {
  selected: 'selected'
}


// /**
//  * Shortcut method for quickly appending elements
//  * @param {HTMLElement} parent
//  * @param {string} [nodeName]
//  * @param {string} [content]
//  * @param {object[]} attrs
//  * @return {HTMLDivElement}
//  */
// export function appendChild(parent, nodeName='div', content, attrs){
//   const elm = document.createElement(nodeName)
//   Object.entries(attrs).forEach(([name, value])=>elm.setAttribute(name, value))
//   if (typeof content === 'string'){
//     elm.innerHTML = content
//   } else {
//     elm.appendChild(content)
//   }
//   parent && parent.appendChild(elm)
//   return elm
// }

/**
 * Parse string into element
 * @param {string} s
 * @returns {DocumentFragment}
 */
export function stringToElement(s){
  const tmpl = document.createElement('div')
  tmpl.innerHTML = s
  const frag = document.createDocumentFragment()
  while (tmpl.children.length) frag.appendChild(tmpl.firstChild)
  return frag
}

/**
 * Queryselect all the parents
 * @param {HTMLElement} elm
 * @param {string} query
 * @param {boolean} inclusive
 * @returns {HTMLElement}
 */
export function parentQuerySelector(elm, query, inclusive=false){
  const closest = elm.closest(query)
  const isChild = closest&&closest.contains(elm)
  return isChild&&closest||inclusive&&elm.matches(query)
}

/**
 * Remove all children
 * @param {HTMLElement} elm
 * @returns {HTMLElement}
 */
export function clean(elm){
  while (elm.firstChild) elm.removeChild(elm.firstChild)
  return elm
}

/**
 * Apply method to each of the selected elements
 * @param {HTMLElement} root
 * @param {string} selector
 * @param {function} fn
 */
export function selectEach(root, selector, fn){
  Array.from(root.querySelectorAll(selector)).forEach(fn)
}

// /**
//  * Load javascript file
//  * @param {string} src
//  * @returns {Promise}
//  */
// export function loadScript(src){
//   return new Promise((resolve, reject)=>{
//     let script = document.createElement('script')
//     document.body.appendChild(script)
//     script.addEventListener('load', resolve)
//     script.addEventListener('error', reject)
//     script.setAttribute('src', src)
//   })
// }

/**
 * Wrapped emmet expand to have line-breaks in string literals
 * @param {string} s
 * @return {String}
 */
export function expand(s){
  return emmetExpand(s
      .replace(/\r\n\s*|\r\s*|\n\s*/g, '')
  )
}

/**
 * Small utility method for quickly creating elements.
 * @name createElement
 * @param {String} [type='div'] The element type
 * @param {String|Array} classes An optional string or list of classes to be added
 * @param {HTMLElement} parent An optional parent to add the element to
 * @param {Object} attributes An optional click event handler
 * @param {String} text An optional click event handler
 * @param {Function} click An optional click event handler
 * @returns {HTMLElement} Returns the newly created element
 */
export function createElement(type, classes, parent, attributes, text, click){
  const mElement = document.createElement(type||'div')
  if (attributes) for (let attr in attributes) mElement.setAttribute(attr, attributes[attr])
  if (classes){
    const oClassList = mElement.classList
      , aArguments = typeof(classes)==='string'?classes.split(' '):classes
    oClassList.add.apply(oClassList, aArguments)
  }
  if (text) mElement.textContent = text
  click&&mElement.addEventListener('click', click)
  parent&&parent.appendChild(mElement)
  return mElement
}

/**
 * Simple string method for converting markdown syntax links only
 * @param {string} text
 * @return {string}
 */
export function markdownLinks(text){
  const matches = text.match(/\[([^\]]*)]\(([^)]*)\)/g)
  matches&&matches.forEach(match=>{
    const [ehr, title, uri] = match.match(/\[([^\]]*)]\(([^)]*)\)/)
    text = text.replace(match, `<a href="${uri}">${title}</a>`)
  })
  return text
}

/**
 * Get the index of an element (in relation to the parent_
 * @param {Element} elm
 * @return {number}
 */
export function getElementIndex(elm){
  return Array.from(elm.parentNode.children).indexOf(elm)
}