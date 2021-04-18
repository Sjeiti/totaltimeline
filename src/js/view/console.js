import {create} from './component'
import {getFragment} from '../util'
import {ENV} from '../config'

const writable = true
let oldLog

create(
  'data-console'
  ,{
    init(element){
      if (ENV.development){

        element.appendChild(
          getFragment('<pre><pre>')
        )
        this._pre = element.querySelector('pre')
        this.output('console')
        oldLog = console.log
        console.log = this.output.bind(this)
        /*window.addEventListener('error',e=>{
          this.output(JSON.stringify(e))
        })*/
        window.addEventListener('error', e=>{
          const {message, filename, lineno, colno, error} = e
          this.output('err',
            message,'\n',
            filename,
            lineno,
            colno,
            error)
        })

        Object.assign(this._pre.style,{
          width: '100%',
          overflow: 'scroll',
          backgroundColor: '#888',
          border: '1px solid gray',
          font: '8px/8px Monospace',
          whiteSpace: 'wrap',
          color: 'black'
        })
       
      }
    }
    ,output(...s){
      const text = this._pre.textContent + '\n' + s.join(' ') //Array.prototype.slice.call(arguments).join(' ')
      const split = text.split(/\n/g)
      this._pre.textContent = split.slice(Math.max(split.length-6,0)).join('\n')

      oldLog&&oldLog(...s)
    }
  }
  ,{
    _pre: {writable}
  }
)
