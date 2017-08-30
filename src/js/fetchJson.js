export function fetchJson(name){
  return fetch(`/static/${name}.json`)
    .then(response=>response.json())
}

export default {
  fetchJson
}
