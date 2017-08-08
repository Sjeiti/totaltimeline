/**
 * Do a jsonp request
 * @name jsonp
 * @method
 * @param {string} uri
 * @param {Function} callback
 **/
let iNr = 2222
export default function jsonp(uri,callback){
  iNr++
  const sCallback = btoa(Date.now()).toLowerCase().replace(/[^a-z]/g,'')+iNr
    ,mScript = document.createElement('script')
  console.log(sCallback)
  mScript.src = uri+'&callback='+sCallback
  document.getElementsByTagName('head')[0].appendChild(mScript)
  window[sCallback] = function(data) {
    callback(data)
    mScript.parentNode.removeChild(mScript)
    delete window[sCallback]
  }
}