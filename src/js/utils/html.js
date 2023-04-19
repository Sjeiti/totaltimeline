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
 * Wrapped emmet expand to have line-breaks in string literals
 * @param {string} s
 * @return {String}
 */
export function expand(s){
  return emmetExpand(s
    .replace(/\r\n\s*|\r\s*|\n\s*/g, '')
  )
}
