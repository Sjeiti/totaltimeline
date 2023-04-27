import {editEvent,newEvent} from './model'
import {stringToElement} from './util'
import {postForm,del} from './fetchProxy'
import {event} from './collections/event'
import {events} from './collections/events'
import {moment} from './time/moment'
import {eventInfo} from './time/eventInfo'
import {initComponents} from "./view/component"
import {parentQuerySelector} from "./utils/html"
import {ENV} from './config'

const noop = ()=>{}
const eventKeys = {
  ago:           {type: 'number'}
  ,since:        {type: 'number'}
  ,year:         {type: 'number'}
  ,accuracy:     {type: 'text'}
  ,name:         {type: 'text'}
  ,exclude:      {type: 'text'}
  ,importance:   {type: 'text'}
  ,icon:         {type: 'select', options:[]}
  ,category:     {type: 'select', options:[]}
  ,tags:         {type: 'text'}
  ,wikimediakey: {type: 'text'}
  ,wikimedia:    {type: 'text'}
  ,explanation:  {type: 'text'}
  ,image:        {type: 'text'}
  ,thumb:        {type: 'text'}
  ,imagename:    {type: 'text'}
  ,imageinfo:    {type: 'text'}
  ,wikijson:     {type: 'text'}
  ,links:        {type: 'text'}
  ,example:      {type: 'text'}
  ,remark:       {type: 'text'}
}

const initString = s=>initComponents(stringToElement(s))

ENV.development&&fetch('/api')
  .then(response=>response.json(),noop)
  // .then(data=>new Promise(resolve=>setTimeout(resolve.bind(null, data),5000)))
  .then(data=>data.success&&initCMS(),noop)

function initCMS(){
  editEvent.add(onEditEvent)
  newEvent.add(onNewEvent)
  // get list of available icons
  Array.from(document.styleSheets).forEach(sheet=>{
    Array.from(sheet.cssRules).forEach(rule=>{
      const match = rule.selectorText&&rule.selectorText.match(/^\.event\.icon-([a-z0-9\-]+)$/)
      match && eventKeys.icon.options.push(match[1])
    })
  })
  // category
  events.dataLoaded.add(()=>{
    eventKeys.category.options = [...new Set(events.map(event=>event.entry.category).filter(cat=>cat))]
  })
}

function onEditEvent(event){
  const inputs = Object.entries(eventKeys).map(entry=>{
    const [name, {type, options}] = entry
    const value = (event.entry[name]?.toString()||'').replace(/(["<>\n])/g,'\\$1')||''
    return `<label>
      <span>${name}</span>
      ${getInput(name, value, type, options)}
      ${name==='wikimedia'&&'<button className="btn float-right" type="button" data-wikimedia-reload>r</button>'||''}
    </label>`
  })
  /*<input type="${type}" name="${name}" value="${value}" ${list&&`list="${name}list"`||''} />${list&&list||''}*/
  const element = initString(`<div class="modal"><div class="modal-content">
  <button class="btn-icon float-right" data-close><svg data-icon="cross"></svg></button>
  <h4>Edit event</h4>
  <form method="post" action="/api/events">
    ${inputs.join('')}
    <input type="hidden" name="index" value="${event.index}" />
    <p><br/>
      <button class="btn float-right">save</button>
      <button class="btn float-right" type="button" data-close>cancel</button>
      <button class="btn float-right" type="button" data-delete>delete</button>
      <button class="btn float-right" type="button" data-new>new</button>
    </p>
  </form>
</div></div>`)
  document.body.appendChild(element)
  element.querySelector('form').addEventListener('submit',onSubmit)
  element.addEventListener('click',onClick.bind(null,element))
  element.querySelector('[data-wikimedia-reload]').addEventListener('click',onReloadWikiMedia)
}

function onSubmit(e){
  e.preventDefault()
  postForm(e.target)
    .then(response=>{
      console.log('response',response)
      // response.error||reload()
    })
}

function onClick(element,e){
  const {target} = e
  const button = parentQuerySelector(target, 'button', true)
  if (button) {
    button.hasAttribute('data-close')&&document.body.removeChild(element)
    ||button.hasAttribute('data-new')&&onNewEvent()
    ||button.hasAttribute('data-delete')&&deleteEvent(target.form.action,event)
  }
}

function onReloadWikiMedia(){
  console.log('onReloadWikiMedia',document.querySelector('[name=wikimediakey]').value) // todo: remove log
  fetch('https://en.wikipedia.org/wiki/Formation_and_evolution_of_the_Solar_System')
    .then(res=>{
      console.log('onReloadWikiMedia response',res) // todo: remove log
    })
}

// async function onReloadWikiMedia(){
//   console.log('onReloadWikiMedia',document.querySelector('[name=wikimediakey]').value) // todo: remove log
//   const response = await fetch('https://en.wikipedia.org/wiki/Formation_and_evolution_of_the_Solar_System')
//   console.log('response', response) // todo: remove log
// }

function getInput(name, value, type, options=[]){
  return type==='select'
  &&`<select name="${name}" value="${value}">${options.map(option=>`<option value="${option}" ${option===value?'selected':''}>${option}</option>`).join('')}</select>`
  ||`<input type="${type}" name="${name}" value="${value}" />`
}

function reload(){
  // window.location.reload(false)
  window.location.reload()
}

function onNewEvent(){
  onEditEvent(event(
    moment(0)
    ,eventInfo()//.parse(entry)
    ,-1
    ,{}
  ))
}

function deleteEvent(url,{index}){
  confirm(`Delete this event?`)&&del(url,{index})
    .then(response=>{
      response.success&&reload()
    },console.warn.bind(console))
}
