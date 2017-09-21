import {create} from './component'
import collections from '../collections'
import {stringToElement,getFragment} from '../util'

export default create(
  'data-collection-menu'
  ,{
    init(){
      const html = getFragment(`<label for="collections-checkbox">collections</label>
<input type="checkbox" id="collections-checkbox" class="visuallyhidden" />
<ul></ul>`)
        ,ul = html.querySelector('ul')

      ul.addEventListener('change', this._onChange.bind(this))

      collections.forEach(collection=>{
        const li = stringToElement(`<li><label><input type="checkbox" checked /> ${collection.name}</label></li>`)
          ,input = li.querySelector('input')
        input.collection = collection
        ul.appendChild(li)
      })

      this.element.appendChild(html)
    }
    ,_onChange({target}){
      target.collection.show(target.checked)
    }
  }
)
