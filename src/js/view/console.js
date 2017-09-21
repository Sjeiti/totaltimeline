import {create} from './component'
import {getFragment} from '../util'

const writable = true
let oldLog

export default create(
  'data-console'
  ,{
    init(element){
      element.appendChild(
        getFragment('<h3>foo<h3><pre><pre>')
      )
      this._pre = element.querySelector('pre')
      this.output('console')
      oldLog = console.log
      console.log = this.output.bind(this)
      /*window.addEventListener('error',e=>{
        this.output(JSON.stringify(e))
      })*/
      window.addEventListener('error', (msg, url, line, col, error)=>{
        this.output('err',msg, url, line, col, error)
      })

      Object.assign(this._pre.style,{
        width: '100%',
        backgroundColor: '#888',
        border: '1px solid gray',
        font: '8px/8px Monospace'
      })
    }
    ,output(...s){
      const text = this._pre.textContent + '\n' + s.join(' ') //Array.prototype.slice.call(arguments).join(' ')
        ,split = text.split(/\n/g);
      this._pre.textContent = split.slice(Math.max(split.length-6,0)).join('\n')

      oldLog&&oldLog(...s)
    }
  }
  ,{
    _pre: {writable}
  }
)
