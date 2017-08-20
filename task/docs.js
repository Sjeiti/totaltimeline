const request = require('request')
  ,{save} = require(__dirname+'/utils')
  ,spreadsheetKey = '1wn2bs7T2ZzajyhaQYmJvth3u2ikZv10ZUEpvIB9iXhM'
  ,sheets = ['events','eras','pages']

sheets.forEach((name,i)=>{
  const worksheet = i+1
    ,endpoint = `https://spreadsheets.google.com/feeds/list/${spreadsheetKey}/${worksheet}/public/values?alt=json`
  getDocsJson(endpoint)
    .then(rows=>rows.map(parseRow))
    .then(rows=>save(`./temp/${name}.json`,JSON.stringify(rows)))
})

function getDocsJson(url,json=true){
  return new Promise((resolve,reject)=>{
    request({url,json}, (error, response, body)=>{
      if (!error && response.statusCode === 200) {
        resolve(body.feed.entry)
      } else {
        reject(error)
      }
    })
  })
}

function parseRow(row){
  const data = {}
	for (let s in row) {
	  if (/^gsx\$/.test(s)) {
      data[s.substr(4)] = row[s].$t
    }
  }
  return data
}