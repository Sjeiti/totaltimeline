
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
    inputs.push(`<label><span>${prop}</span><input type="text" name="${prop}" value="${event.entry[prop]||''}" /></label>`)
  })
  const element = stringToElement(`<div class="modal"><div class="modal-content">
  <h4>Edit event</h4><button data-close>&#215;</button>
  <form method="post" action="/api/events">
    ${inputs.join('')}
    <input type="hidden" name="index" value="${event.index}" />
    <button data-save>save</button>
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