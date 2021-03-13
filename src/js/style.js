console.log('style.js') // todo: remove log

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
  ,aoStyleSheets = document.styleSheets
  ,bReversedSelectors = (function(){
    // creates a new selector and checks if the rule comes out in reverse
    const oSheet = (function() {
          const style = document.createElement('style')
          style.appendChild(document.createTextNode(''))
          document.head.appendChild(style)
          return style.sheet
        })()
      ,aRules = oSheet.cssRules
      ,iNumRules = aRules.length
      ,sSelector = 'span#a.c.d.b'
    let sSelectorResult
      ,bIsReversed

    oSheet.addRule(sSelector, 'font-weight:inherit')
      sSelectorResult = aRules[iNumRules].selectorText
      bIsReversed = sSelectorResult!=sSelector
    oSheet.deleteRule(iNumRules)
    return bIsReversed
  })()

/**
 * Reverses a selector (because IE rearanges selectors)
 * Turns span#a.c.d.b into span.b.c.d#a
 * @param {String} selector
 * @returns {String} Reversed selector
 */
function getReverse(selector){
  const oSheet = aoStyleSheets[0]
    ,aRules = oSheet.cssRules
    ,iNumRules = aRules.length
  let sSelectorResult

  oSheet.addRule(selector, 'font-weight:inherit')
  sSelectorResult = aRules[iNumRules].selectorText
  oSheet.deleteRule(iNumRules)
  return sSelectorResult
}

/**
 * Get an array of CSSStyleRules for the selector string.
 * @param {String} selector
 * @returns {rule}
 */
export function select(selector){
  selector = bReversedSelectors?getReverse(parseSelector(selector)):parseSelector(selector)
  const aStyles = rule(selector)
  forEach.apply(aoStyleSheets,[function(styleSheet){
    let aRules = styleSheet.cssRules
    aRules && forEach.apply(aRules,[function (oRule) {
      if (oRule.constructor===window.CSSStyleRule) {
        //console.log('oRule.selectorText',oRule.selectorText); // log
        if (oRule.selectorText.split(' {').shift()==selector) {
          aStyles.push(oRule)
        }
      }
    }])
  }])
  return aStyles
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
function changeRule(selector,rules) {
  return select(selector).set(rules)
}

/**
 * Adds a new rule to the selector
 * @param selector
 * @param rules
 * @returns {CssRule}
 */
function addRule(selector,rules) {
  let oSheet, sRules = ''
	forEach.call(rules,(val,prop)=>{sRules+=prop+':'+val+';'})
  // loop(rules,function(val,prop){sRules+=prop+':'+val+';';})
  oSheet = aoStyleSheets[0]
  oSheet.addRule(selector,sRules)
  return oSheet.cssRules[oSheet.cssRules.length-1]
}

/**
 * A array of CSSStyleRules enhanced with some methods.
 * @returns {CSSStyleRule[]}
 */
function rule(selector) {
  var aStyles = []
  aStyles.toString = function(){return '[object style.rule:'+selector+']';}
  aStyles.set = function (key,prop) {
    if (typeof key==='string') {
      set.apply(aStyles,[key,prop])
    } else {
      for (var s in key) {
        set.apply(aStyles,[s,key[s]])
      }
    }
  }
  function set(key,prop) {
    aStyles.forEach(function (rule) {
      var oStyle = rule.style
      oStyle.removeProperty(key)
      oStyle[key] = prop
    })
  }
  return aStyles
}

/**
 * Getstyle method from Quircksmode
 * @see: http://www.quirksmode.org/dom/getstyles.html
 * @param el
 * @param styleProp
 * @returns {*|string}
 */
function getStyle(el,styleProp) {
  return el.currentStyle?el.currentStyle[styleProp]:document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp)
}

// todo: document
function getSheetByMedia(type) {
  let oSheet, i, j, l, ll
  for (i=0,l=document.styleSheets.length;i<l;i++) {
    oSheet = document.styleSheets[i]
    for (j=0,ll=oSheet.media.length;j<ll;j++) {
      if (oSheet.media[j]===type) break
    }
  }
  return oSheet
}

export default {
  select
  ,changeRule
  ,addRule
  ,get: getStyle
  ,getSheetByMedia
}