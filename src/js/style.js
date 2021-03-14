/**
 * Namespace to manipulate existing stylesheets.
 * @name style
 */

// StyleSheet.addRule shim
if (document.styleSheets[0].addRule===undefined) {
  window.StyleSheet.prototype.addRule = function(selector,value){
    return this.insertRule(selector + '{' + value + '}', this.cssRules.length)
  }
}

const forEach = Array.prototype.forEach
const styleSheets = document.styleSheets
const isReversedSelectors = (function(){
  // creates a new selector and checks if the rule comes out in reverse
  const sheet = (function() {
    const style = document.createElement('style')
    style.appendChild(document.createTextNode(''))
    document.head.appendChild(style)
    return style.sheet
  })()
  const rules = sheet.cssRules
  const numRules = rules.length
  const selector = 'span#a.c.d.b'

  sheet.addRule(selector, 'font-weight:inherit')
  const selectorResult = rules[numRules].selectorText
  const isReversed = selectorResult!==selector
  sheet.deleteRule(numRules)
  return isReversed
})()

/**
 * Reverses a selector (because IE rearanges selectors)
 * Turns span#a.c.d.b into span.b.c.d#a
 * @param {String} selector
 * @returns {String} Reversed selector
 */
function getReverse(selector){
  const sheet = styleSheets[0]
  const rules = sheet.cssRules
  const numRules = rules.length

  sheet.addRule(selector, 'font-weight:inherit')
  const selectorResult = rules[numRules].selectorText
  sheet.deleteRule(numRules)
  return selectorResult
}

/**
 * Get an array of CSSStyleRules for the selector string.
 * @param {String} selector
 * @returns {rule}
 */
export function select(selector){
  selector = isReversedSelectors?getReverse(parseSelector(selector)):parseSelector(selector)
  const styles = rule(selector)
  forEach.apply(styleSheets,[function(styleSheet){
    const rules = styleSheet.cssRules
    rules && forEach.apply(rules,[function (rule) {
      if (rule.constructor===window.CSSStyleRule) {
        //console.log('rule.selectorText',rule.selectorText); // log
        if (rule.selectorText.split(' {').shift()===selector) {
          styles.push(rule)
        }
      }
    }])
  }])
  return styles
}

/**
 * Parse a selector string correctly
 * @param {string} selector
 * @returns {string}
 */
function parseSelector(selector) {
  return selector.replace('>',' > ').replace('  ',' ')
}

/**
 * Change an existing selector with the rules parsed in the object.
 * @param {String} selector
 * @param {Object} rules
 * @returns {CSSStyleRule[]} The Array created by select
 */
export function changeRule(selector,rules) {
  return select(selector).set(rules)
}

/**
 * Adds a new rule to the selector
 * @param selector
 * @param rules
 * @returns {CSSRule}
 */
export function addRule(selector,rules) {
  let rulesString = ''
  forEach.call(rules,(val,prop)=>{rulesString+=prop+':'+val+';'})
  const sheet = styleSheets[0]
  sheet.addRule(selector,rulesString)
  return sheet.cssRules[sheet.cssRules.length-1]
}

/**
 * A array of CSSStyleRules enhanced with some methods.
 * @returns {CSSStyleRule[]}
 */
function rule(selector) {
  const styles = []
  styles.toString = function(){return '[object style.rule:'+selector+']'}
  styles.set = function (key,prop) {
    if (typeof key==='string') {
      set.apply(styles,[key,prop])
    } else {
      for (const s in key) {
        set.apply(styles,[s,key[s]])
      }
    }
  }
  function set(key,prop) {
    styles.forEach((rule) => {
      const style = rule.style
      style.removeProperty(key)
      style[key] = prop
    })
  }
  return styles
}

/**
 * Getstyle method from Quircksmode
 * @see: http://www.quirksmode.org/dom/getstyles.html
 * @param el
 * @param styleProp
 * @returns {*|string}
 */
export function getStyle(el,styleProp) {
  return el.currentStyle?el.currentStyle[styleProp]:document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp)
}

// todo: document
export function getSheetByMedia(type) {
  let sheet
  let i
  let j
  let l
  let ll
  for (i=0,l=document.styleSheets.length;i<l;i++) {
    sheet = document.styleSheets[i]
    for (j=0,ll=sheet.media.length;j<ll;j++) {
      if (sheet.media[j]===type) break
    }
  }
  return sheet
}