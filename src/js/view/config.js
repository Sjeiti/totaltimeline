import {create} from './component'
import {collections} from '../collections'
import {stringToElement,getFragment} from '../util'

const {documentElement} = document

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
      this._initConfig(html)
      this._initCollections(html)
      this._initDarkmode(html)
      element.appendChild(html)
    }
    ,_initConfig(html){
      const checkbox = html.querySelector('#config-checkbox')
      const label = html.querySelector('label')
      const div = html.querySelector('div')
      documentElement.addEventListener('mousedown', this._onDownOutside.bind(this, checkbox, label, div))
    }
    ,_initCollections(html){
      const ul = html.querySelector('ul')
      const map = collections.reduce((acc, collection)=>{
        const li = stringToElement(`<li><label><input type="checkbox" ${collection._hidden?'':'checked'} /> ${collection.name}</label></li>`)
        const input = li.querySelector('input')
        ul.appendChild(li)
        return acc.set(input, collection)
      }, new Map())
      ul.addEventListener('change', this._onChange.bind(this, map))
    }
    ,_initDarkmode(html){
      localStorage.dark&&this._setDarkmode()
      html.querySelector('[data-dark]').addEventListener('change', ::this._onChangeDark)
    }
    ,_onChange(map, e){
      const {target} = e
      map.get(target)?.show(target.checked)
    }
    ,_onChangeDark(e){
      const isDark = !!localStorage.dark
      isDark?localStorage.removeItem('dark'):localStorage.setItem('dark',1)
      this._setDarkmode(!isDark)
    }
    ,_onDownOutside(checkbox, label, div, e){
      const {target} = e
      const isOutside = div!==target&&!div.contains(target)
                        &&label!==target&&!label.contains(target)
      isOutside&&(checkbox.checked = false)
    }
    ,_setDarkmode(dark=true){
      document.documentElement.classList.toggle('darkmode', dark)
    }
  }
)
