import {create} from './component'
import {getFragment} from '../util'
import {VERSION,ENV} from "../config"
import {parentQuerySelector} from '../utils/html'
import {newEvent} from '../model'

create(
  'data-header'
  ,{
    init(element){
      element.appendChild(getFragment(`<h2><a title="v${VERSION}" href="#totaltimeline">Total Timeline</a></h2>
<div data-collection-menu></div>
${ENV.development?'<button data-new>new<!--<svg data-icon="pencil"></svg>--></button>':''}
<div data-search></div>`))


      element.addEventListener('click',e=>{
        const {target} = e
        const button = parentQuerySelector(target, 'button')
        button?.hasAttribute('data-new')&&newEvent.dispatch()
      })
    }
  }
)
