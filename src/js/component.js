import {parseOptions} from './util'

/**
 * A component factory
 */
const
  componentFactories = {}
  ,instances = new Map()
  ,body = document.body
  ,eventNames = 'mousedown,mouseup,click,dblclick,submit,focus,blur,keydown,keyup,keypress'.split(/,/g)
  ,eventHandlers = eventNames.map(name=>'on'+name.substr(0,1).toUpperCase()+name.substr(1))
  ,eventInstances = eventNames.map(()=>[])
  ,eventInitialised = eventNames.map(()=>false)
  //
  ,writable = true
  ,basePrototype = {
    _init(elm,opts){
      Object.seal(this)
      this.element = elm
      this.options = parseOptions(opts)
      this.html = document.createDocumentFragment()
      while (elm.firstChild) this.html.appendChild(elm.firstChild)
      return this
    }
  }
  ,baseProperties = {
    element: {writable}
    ,options: {writable}
    ,html: {writable}
  }

/**
 * Create a component factory bound to an attribute
 * @param {string} componentAttribute
 * @param {function} componentPrototype
 * @param {function} componentProperties
 */
export function create(attr,componentPrototype,componentProperties){
  if (componentFactories[attr]) {
    throw new Error(`Component with attribute '${componentAttribute}' already initialised`)
  } else {
    const name = attr.replace(/^data\-/,'').replace(/^(.)/,s=>s.toUpperCase())
      ,proto = Object.assign(componentPrototype||{},basePrototype,{
        toString: ()=>`[object ${name}]`
      })
      ,props = Object.assign(componentProperties||{},baseProperties)
    componentFactories[attr] = (element,options)=>{
      const inst = Object.create(proto,props)._init(element,options)
      inst.init&&inst.init()
      return inst
    }
  }
}

/**
 * Initialise manually so clear the next tick timeout
 */
export function initialise(){
  initComponents(body)
  initEvents()
  dispatchOnInit()
}

/**
 * Find and return the component instance for an element
 * @param {HTMLElement} element
 * @returns {object}
 */
export function of(element){
  return instances.get(element)
}

/**
 * Loop through all possible component-attributes, querySelect them all and instantiate their related class
 * @param {HTMLElement} rootElement
 * @param {string} [childOfAttr]
 * @todo childOfAttr should be array of all recursed attrs
 * @private
 */
function initComponents(rootElement,childOfAttr){
  for (const attr in componentFactories) {
    const elements = Array.from(rootElement.querySelectorAll(`[${attr}]`))
    const isRecursive = attr===childOfAttr&&elements.length
    if (isRecursive) {
      console.warn('Recursive component detected',rootElement,attr)
      throw new Error(`Recursive component detected on ${rootElement} and ${attr}`,rootElement)
    } else {
      elements.map(element=>initElement(element,attr))
    }
  }
}

/**
 * Initialise a single element component
 * @param {HTMLElement} element
 * @param {string} attr
 * @private
 */
function initElement(element,attr){
  if (!of(element)) {
    const options = element.getAttribute(attr)
    const componentClass = componentFactories[attr]
    const instance = componentClass(element,options)
    initComponents(instance.element,attr)
    eventHandlers.forEach((handler,i)=>{
      instance[handler]&&eventInstances[i].push(instance)
    })
    element.component = instance
    instances.set(element, instance)
  }
}

/**
 * Check event instances and apply all events too root element
 * @todo may not need this.eventInitialised
 * @private
 */
function initEvents(){
  eventInstances.forEach((list,i)=>{
    const hasTargets = list.length,
        isInitialised = eventInitialised[i]
    if (hasTargets&&!isInitialised) {
      body.addEventListener(eventNames[i],onEvent.bind(null,list,eventHandlers[i]))
      eventInitialised[i] = true
    }
  })
}

/**
 * Call onInit on instances after all instances are created
 * @private
 */
function dispatchOnInit(){
  for (const instance of instances.values()) {
    instance.onInit&&instance.onInit()
  }
}

/**
 * Global event handler proxy delegating events to subscribed components
 * @param {BaseComponent[]} list
 * @param {function} handler
 * @param {Event} e
 * @private
 */
function onEvent(list,handler,e){
  let target = e.target
  const parents = [];
  while (target&&target!==body) {
      parents.unshift(target);
      target = target.parentNode;
  }
  list.forEach(comp=>{
    parents.includes(comp.element)&&comp[handler](e)
  })
}

export default {
  create
  ,initialise
  ,of
}
