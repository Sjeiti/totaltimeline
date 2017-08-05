import readyState from './signal/readyState'
import {initialise} from './component'
import time from './time'
import moment from './time/moment'
import range from './time/range'
import animate from './animate'
import './console'
import {parseOptions,getFragment} from './util'

initialise()

console.log(time.formatAnnum(time.UNIVERSE,2))

readyState.add(console.log.bind(console))
console.log('rs',document.readyState)

console.log(moment(2838))
console.log(moment(1974,moment.YEAR))

const life = range(
  moment(1974,moment.YEAR)
  ,moment(2017,moment.YEAR)
)
life.change.add(console.log.bind(console))
console.log(life.duration)

console.log(life.factory===range,life)

life.moveStart(100)
console.log(life.duration)

/*life.animate(90,180,()=>{
  console.log(life)
})*/

//console.log('po',parseOptions)

/////////////////////////
/////////////////////////
/////////////////////////

/*const writable = true
  ,mproto = {
    _init(elm,opts){
      Object.seal(this)
      this.element = elm
      this.options = parseOptions(opts)
      this.html = document.createDocumentFragment()
      while (elm.firstChild) this.html.appendChild(elm.firstChild)
      return this
    }
  }
  ,mprops = {
    element: {writable}
    ,options: {writable}
    ,html: {writable}
  }
function create(attr,proto,props){
  const name = attr.replace(/^data\-/,'').replace(/^(.)/,s=>s.toUpperCase())
    ,prot = Object.assign(proto||{},mproto,{
      toString: ()=>`[object ${name}]`
    })
    ,prop = Object.assign(props||{},mprops)
  return (elm,opts)=>{
    const inst = Object.create(prot,prop)._init(elm,opts)
    inst.init&&inst.init()
    return inst
  }
}*/

/////////////////////////

/*const cproto = {
    init(){
      console.log('init',this,this.element)
      this.element.appendChild(
        getFragment('<h3>foo<h3><pre><pre>')
      )
      this._pre = this.element.querySelector('pre')
      this.output('console')
    }
    ,output(...s){
      const text = this._pre.textContent + '\n' + s.join(' ') //Array.prototype.slice.call(arguments).join(' ')
        ,split = text.split(/\n/g);
      this._pre.textContent = split.slice(Math.max(split.length-22,0)).join('\n');
    }
  }
  ,cprops = {
    _pre: {writable} 
  }
const fact = create(
  'data-foo'
  ,cproto
  ,cprops
)*/

/////////////////////////
/*const d1 = document.createElement('div')
const d2 = document.createElement('div')
const f1 = fact(d1)
const f2 = fact(d2)
console.log(f1,f1===f2,f1.prototype===f2.prototype)*/


/*const elm = document.body.querySelector('[data-foo]')
  ,inst = elm&&fact(elm)

console.log(inst)*/
