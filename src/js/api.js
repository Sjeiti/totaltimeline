
import model from './model'
import {stringToElement} from './util'
import {postForm} from './fetchProxy'

const noop = ()=>{}

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
}

function onEditEvent(event){
  console.log('onEditEvent',event.index); // todo: remove log
  /*const keys = [
    'ago'
    ,'since'
    ,'year'
    ,'accuracy'
    ,'name'
    ,'exclude'
    ,'importance'
    ,'icon'
    ,'category'
    ,'tags'
    ,'wikimediakey'
    ,'explanation'
    ,'wikimedia'
    ,'image'
    ,'thumb'
    ,'imagename'
    ,'imageinfo'
    ,'wikijson'
    ,'links'
    ,'example'
    ,'remark'
  ]*/
  const keys = ['ago','since','year','accuracy','name','exclude','importance','icon','category','tags','wikimediakey','explanation','wikimedia','image','thumb','imagename','imageinfo','wikijson','links','example','remark']
    ,inputs = [];
  keys.forEach(prop=>{
    inputs.push(`<label><span>${prop}</span><input type="text" name="${prop}" value="${(event.entry[prop]||'').replace(/(["<>\n])/g,'\\$1')||''}" /></label>`)
  })
  const element = stringToElement(`<div class="modal"><div class="modal-content">
  <button class="btn-icon icn-cross float-right" data-close></button>
  <h4>Edit event</h4>
  <form method="post" action="/api/events">
    ${inputs.join('')}
    <input type="hidden" name="index" value="${event.index}" />
    <p><br/><button class="btn float-right" data-save>save</button></p>
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
    }
  })
}