export function fetchJson(name){
  return fetch(`/static/${name}.json`)
    .then(response=>response.json())
}

export function postForm(form){
  /*const body = {};
  Array.from(form.elements).forEach(elm=>{
    const {name, value} = elm
    if (name) body[name] = value
  })*/
  const body = Array.from(form.elements).reduce((body,{name, value})=>{
    if (name) body[name] = value
    return body
  },{})
  const headers = new Headers()
  headers.append('Content-Type', 'application/json');
  return fetch(form.action,{
    method: 'POST'
    ,headers
    ,body: JSON.stringify(body)
  })
    .then(response=>response.json(),console.warn.bind(console,'error:'))
}

export default {
  fetchJson
  ,postForm
}
