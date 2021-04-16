import {create} from './component'
import {collections} from '../collections'
import {stringToElement,getFragment} from '../util'

create(
  'data-config'
  ,{
    init(element){
      const html = getFragment(`<label for="collections-checkbox"><svg data-icon="cog"></svg></label>
<input type="checkbox" id="collections-checkbox" class="visuallyhidden" />
<div>
<h4>collections</h4>
<ul></ul>
<h4><label><input type=checkbox data-dark /> dark mode</label></h4>
</div>`)
      const ul = html.querySelector('ul')

      ul.addEventListener('change', this._onChange.bind(this))

      collections.forEach(collection=>{
        const li = stringToElement(`<li><label><input type="checkbox" checked /> ${collection.name}</label></li>`)
        const input = li.querySelector('input')
        input.collection = collection
        ul.appendChild(li)
      })

      element.appendChild(html)


      document.querySelector('[data-dark]').addEventListener('change', this._onChangeDark.bind(this))
    }
    ,_onChange({target}){
      target.collection.show(target.checked)
      console.log(collection.name)
    }
    ,_onChangeDark(e){
      console.log(e)
    }
  }
)
