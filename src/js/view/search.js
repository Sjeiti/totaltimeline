import {create} from './component'
import {getFragment} from '../util'

const writable = true
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
    }
  }
  ,{
    _input: {writable}
    ,_result: {writable}
  }
)
