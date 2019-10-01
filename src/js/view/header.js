import {create} from './component'
import {getFragment} from '../util'
import {VERSION} from "../config";

export default create(
  'data-header'
  ,{
    init(element){
      element.appendChild(getFragment(`<h2><a title="v${VERSION}" href="#totaltimeline">Total Timeline</a></h2>
<div data-collection-menu></div>
<div data-search></div>`))
    }
  }
)
