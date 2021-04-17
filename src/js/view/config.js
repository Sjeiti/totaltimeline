import {create} from './component'
import {collections} from '../collections'
import {stringToElement,getFragment} from '../util'

create(
  'data-config'
  ,{
    init(element){
      const html = getFragment(`<label for="config-checkbox"><svg data-icon="cog"></svg></label>
<input type="checkbox" id="config-checkbox" class="visuallyhidden" />
<div>
<h4>collections</h4>
<ul></ul>
<h4><label><input type=checkbox data-dark /> dark mode</label></h4>
</div>`)

      const checkbox = html.querySelector('#config-checkbox')
      const label = html.querySelector('label')
      const div = html.querySelector('div')
      //document.documentElement.addEventListener('mousedown', this._onDownOutside.bind(this, checkbox, label, div))
      //document.documentElement.addEventListener('mousedown', ::this._onDownOutside(checkbox, label, div))
      document.documentElement.addEventListener('mousedown', e=>{
        const {target} = e
        const isOutside = div!==target&&!div.contains(target)
                          &&label!==target&&!label.contains(target)
        isOutside&&(checkbox.checked = false)
      })

      const ul = html.querySelector('ul')
      ul.addEventListener('change', ::this._onChange)

      collections.forEach(collection=>{
        const li = stringToElement(`<li><label><input type="checkbox" checked /> ${collection.name}</label></li>`)
        const input = li.querySelector('input')
        input.collection = collection
        ul.appendChild(li)
      })

      element.appendChild(html)


      document.querySelector('[data-dark]').addEventListener('change', ::this._onChangeDark)
    }
    ,_onChange({target}){
      target.collection.show(target.checked)
      console.log(collection.name)
    }
    ,_onChangeDark(e){
      // todo localStorage
      document.documentElement.classList.toggle('darkmode')
    }
    ,_onDownOutside(e, checkbox, label, div){
      const {target} = e
      const isOutside = div!==target&&!div.contains(target)
                        &&label!==target&&!label.contains(target)
      isOutside&&(checkbox.checked = false)
    }
  }
)
