export function getData(name){
  return fetch(`/static/${name}.json`)
    .then(response=>response.json())
}

export default {
  getData
}
