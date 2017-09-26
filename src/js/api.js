
import model from './model'
import {stringToElement} from './util'
import {postForm,del} from './fetchProxy'
import event from './collections/event'
import events from './collections/events'
import moment from './time/moment'
import eventInfo from './time/eventInfo'

const noop = ()=>{}
const eventKeys = ['ago','since','year','accuracy','name','exclude','importance','icon','category','tags','wikimediakey','explanation','wikimedia','image','thumb','imagename','imageinfo','wikijson','links','example','remark']
const eventLists = { category: [], icon: [] }

fetch('/api')
  .then(response=>response.json(),noop)
  .then(data=>{
    if (data.success) {
      model.api = true
      initApi()
    }
  },noop)

function initApi(){
  model.editEvent.add(onEditEvent)
  // get list of available icons
  Array.from(document.styleSheets).forEach(sheet=>{
    Array.from(sheet.cssRules).forEach(rule=>{
      const match = rule.selectorText&&rule.selectorText.match(/^\.event\.icon-([a-z0-9\-]+)$/)
      match && eventLists.icon.push(match[1])
    })
  })
  // category
  events.dataLoaded.add(()=>{
    events.forEach(event=>{
      const category = event.entry.category
      eventLists.category.indexOf(category)===-1&&eventLists.category.push(category)
    })
  })
}



function onEditEvent(event){
  const inputs = [];
  eventKeys.forEach(prop=>{
    let list
    if (eventLists.hasOwnProperty(prop)) {
      list = `<datalist id="${prop}list">${eventLists[prop].map(value=>`<option value="${value}" />`).join('')}</datalist>`
    }
    inputs.push(`<label><span>${prop}</span><input type="text" name="${prop}" value="${(event.entry[prop]||'').replace(/(["<>\n])/g,'\\$1')||''}" ${list&&`list="${prop}list"`||''} />${list&&list||''}</label>`)
  })
  const element = stringToElement(`<div class="modal"><div class="modal-content">
  <button class="btn-icon icn-cross float-right" data-close></button>
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
  //
  // form submission
  const form = element.querySelector('form')
  form.addEventListener('submit',e=>{
    e.preventDefault()
    postForm(e.target)
      .then(response=>{
        console.log('response',response)
        response.error||window.location.reload(false)
      })
  })
  //
  // close view
  element.addEventListener('click',({target})=>{
    if (target.nodeName==='BUTTON') {
      target.hasAttribute('data-close')&&document.body.removeChild(element)
      ||target.hasAttribute('data-new')&&newEvent()
      ||target.hasAttribute('data-delete')&&deleteEvent(event)
    }
  })
}

function newEvent(){
  onEditEvent(event(
    moment(0)
    ,eventInfo()//.parse(entry)
    ,-1
    ,{}
  ))
}

function deleteEvent({index}){
  console.log('deleteEvent',index); // todo: remove log
  del({index})
}