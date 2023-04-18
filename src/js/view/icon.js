import {create} from './component'
import {NS_SVG, NS_XLINK} from '../config'
import root from '!!raw-loader!../../../temp/icomoon/symbol-defs.svg'

// conditional because of prerender
document.querySelector('svg[aria-hidden=true]:not([id])')||document.body.insertAdjacentHTML('afterbegin', root)

/**
 * Search component
 */
create('data-icon', {
  init(element){
    const {dataset:{icon}} = element
    const use = document.createElementNS(NS_SVG, 'use')
    use.setAttributeNS(NS_XLINK, 'xlink:href', `#icon-${icon}`)
    element.appendChild(use)
    element.classList.add('icon', `icon-${icon}`)
  }
})
