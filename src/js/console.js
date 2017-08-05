import {create} from './component'
import {getFragment} from './util'

const writable = true
create(
  'data-foo'
  ,{
    init(){
      console.log('init',this,this.element)
      this.element.appendChild(
        getFragment('<h3>foo<h3><pre><pre>')
      )
      this._pre = this.element.querySelector('pre')
      this.output('console')
      console.log = this.output.bind(this)
      window.addEventListener('error', (msg, url, line, col, error)=>{
        this.output(msg, url, line, col, error)
      })
      this.output('console') 
      Object.assign(this._pre.style,{
        width: '100%', 
        backgroundColor: '#888',
        border: '1px solid gray'
      })
    }
    ,output(...s){
      const text = this._pre.textContent + '\n' + s.join(' ') //Array.prototype.slice.call(arguments).join(' ')
        ,split = text.split(/\n/g);
      this._pre.textContent = split.slice(Math.max(split.length-22,0)).join('\n');
    }
  }
  ,{
    _pre: {writable}
  }
)
