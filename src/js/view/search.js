import {create} from './component'
import {getFragment,clearChildren} from '../util'
import collections from '../collections'
import pages from './pages'

const writable = true
  ,classNameVisible = 'visible'

export default create(
  'data-search'
  ,{
    init(){
      const html = getFragment(`<input type="text" id="search" placeholder="Search" autocomplete="off" />
<ul id="searchResult"></ul>`)
      this._input = html.querySelector('input')
      this._result = html.querySelector('ul')
      this.element.appendChild(html)

      const elmSearch = this._input
        ,searchResult = this._result
        ,searchFragment = document.createDocumentFragment()
      let currentQuery = ''

      elmSearch.addEventListener('keyup',onKeyUp)
      elmSearch.addEventListener('change',onKeyUp)
      elmSearch.addEventListener('focus',onFocusBlur)
      elmSearch.addEventListener('blur',onFocusBlur)

      /**
       * Handle keyup event
       */
      function onKeyUp() {
        const query = elmSearch.value.toLowerCase()
          , found = []
        if (query!==currentQuery) {
          collections.forEach(collection => {
            collection.forEach(entry => {
              const {name, explanation, wikimedia} = entry.info;
              const result = 10*searchString(query, name) + 3*searchString(query, explanation) + searchString(query, wikimedia)
              if (result !== 0) {
                found.push([result, entry])
              }
            })
          })
          Array.from(pages).forEach(page => {
            const {name, copy} = page;
            const indexOnName = name.indexOf(query)
            const result = 10*searchString(query, name) + searchString(query, copy) + (indexOnName!==-1&&Math.min(0,20-indexOnName)||0)
            if (result !== 0) {
              found.push([result, page])
            }
          })
          clearChildren(searchFragment)
          clearChildren(searchResult)
          found
            .sort((a, b) => a[0] > b[0] ? -1 : 1)
            .forEach(found => {
              let entry = found[1]
                , info = entry.info || entry
              searchFragment.appendChild(getFragment(`<li><a href="#${info.slug}">${info.name.replace(query, `<strong>${query}</strong>`)}</a></li>`))
            })
          searchResult.appendChild(searchFragment)
          currentQuery = query
        }
      }

      /**
       * Handle focus and blur event for showing and hiding search results
       * @param {event} e
       */
      function onFocusBlur(e){
        if (e.type==='focus') {
          searchResult.classList.add(classNameVisible)
        } else {
          setTimeout(()=>{
            searchResult.classList.remove(classNameVisible)
          },300)
        }
      }

      /**
       * Search for a string
       * @param {string} needle
       * @param {string} haystack
       * @returns {number} returns 2 for whole word occurrences, 1 for occurrences and 0 for no occurrences
       */
      function searchString(needle,haystack){
        const splitHaystack = haystack.toLocaleLowerCase().split(needle)
          ,haystackLength = splitHaystack.length
          ,regex = wholeWordRegex(needle)
          ,hasWholeWord = regex.test(haystack)
          ,hasWord = haystackLength>1
        return hasWholeWord&&2||hasWord&&1||0
      }

      /**
       * Regex to find a whole word
       * @param {string} string
       * @returns {RegExp}
       */
      function wholeWordRegex(string){
        if (!wholeWordRegex.cache) wholeWordRegex.cache = {}
        let regex = wholeWordRegex.cache[string]
        if (!regex) {
          const escaped = string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
          regex = new RegExp(`(\\b|^)${escaped}(\\b|$)`,'gi')
          wholeWordRegex.cache[string] = regex
        }
        return regex
      }
    }
  }
  ,{
    _input: {writable}
    ,_result: {writable}
  }
)