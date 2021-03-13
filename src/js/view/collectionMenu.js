import {create} from './component'
import collections from '../collections'
import {stringToElement,getFragment} from '../util'

export default create(
  'data-collection-menu'
  ,{
    init(element){
      const html = getFragment(`<label for="collections-checkbox">collections</label>
<input type="checkbox" id="collections-checkbox" class="visuallyhidden" />
<ul></ul>`)
      const ul = html.querySelector('ul')

      ul.addEventListener('change', this._onChange.bind(this))

      collections.forEach(collection=>{
        const li = stringToElement(`<li><label><input type="checkbox" checked /> ${collection.name}</label></li>`)
        const input = li.querySelector('input')
        input.collection = collection
        ul.appendChild(li)
      })

      element.appendChild(html)
    }
    ,_onChange({target}){
      target.collection.show(target.checked)
    }
  }
)
