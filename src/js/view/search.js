import {create} from './component'
import {getFragment,emptyElement} from '../util'
import collection from '../collection'
import pages from './pages'

const writable = true
  ,classNameVisible = 'visible'
create(
  'data-search'
  ,{
    init(){
      const parent = this.element.parentNode
        ,html = getFragment(`<input type="text" id="search" placeholder="Search" autocomplete="off" />
    <ul id="searchResult"></ul>`)
      this._input = html.querySelector('input')
      this._result = html.querySelector('ul')
      parent.insertBefore(html,this.element)
      parent.removeChild(this.element)

      console.log('srch',this._input,this._result,this.element.outerHTML)

      //////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////

      const elmSearch = this._input
        ,searchResult = this._result
        ,searchFragment = document.createDocumentFragment()

      elmSearch.addEventListener('keyup',handleKeyUp)
      elmSearch.addEventListener('change',handleKeyUp)
      elmSearch.addEventListener('focus',handleFocusBlur)
      elmSearch.addEventListener('blur',handleFocusBlur)

      // todo: document
      function handleKeyUp(){
        const sSearch = elmSearch.value.toLowerCase()
          ,aFound = []
         let i,l
          ,sText,iResult

        l = collection.length
        for (i=0;i<l;i++) {
          let aInst = collection[i]
          for (let j=0,m=aInst.length;j<m;j++) {
            let oItem = aInst[j]
            sText = oItem.info.name+' '+oItem.info.explanation+' '+oItem.info.wikimedia
            iResult = searchString(sSearch,sText)
            if (iResult!==0) {
              aFound.push([iResult,oItem])
            }
          }
        }
        l = pages.length
        for (i=0;i<l;i++) {
          let oPage = pages[i]
          sText = oPage.name+' '+oPage.copy
          iResult = searchString(sSearch,sText)
          if (iResult!==0) {
            aFound.push([iResult,oPage])
          }
        }
        emptyElement(searchFragment)
        emptyElement(searchResult)
        aFound.sort(function(a,b){
          return a[0]>b[0]?-1:1
        })
        l = aFound.length
        for (i=0;i<l;i++) {
          let oFind = aFound[i][1]
            ,oInfo = oFind.info||oFind
          searchResult.appendChild(zen('li>a[href=#'+oInfo.slug+']{'+oInfo.name+'}').pop())
        }
        searchResult.appendChild(searchFragment)
      }

      // todo: document
      function handleFocusBlur(e){
        if (e.type==='focus') {
          searchResult.classList.add(classNameVisible)
        } else {
          setTimeout(function(){
            searchResult.classList.remove(classNameVisible)
          },400)
        }
      }

      // todo: document
      function searchString(needle,haystack){
        const aHaystack = haystack.toLocaleLowerCase().split(needle)
          ,iHaystack = aHaystack.length
        let iValue = 0
        if (iHaystack>1) {
          iValue = iHaystack/(aHaystack[0].length+1)
        }
        return iValue
      }

      //////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////
    }
  }
  ,{
    _input: {writable}
    ,_result: {writable}
  }
)
