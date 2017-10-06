/**
 * Create a sitemap from json
 */
c
const builder = require('xmlbuilder')
	,{read,save} = require(__dirname+'/utils')
	,baseUri = 'http://totaltimeline.org/'
	,target = './src/sitemap.xml'
  ,fileEvents = './src/static/events.json'
  ,fileEras = './src/static/eras.json'
	,files = [fileEras,fileEvents]
	,xml = builder.create('urlset',{xmlns:'http://www.sitemaps.org/schemas/sitemap/0.9'})

Promise.all(files.map(read))
	.then(results=>{
		results
			.map(JSON.parse)
			.reduce((a,b)=>(Array.prototype.push.apply(a,b),a))
			.forEach(event=>{
				if (event.exclude!=='1') {
					const url = xml.ele('url')
					url.ele('loc',baseUri+slug(event.name))
					url.ele('lastmod',(new Date).toISOString())
				}
			})
		const xmlEnd = xml.end({ pretty: true})
		save(target,xmlEnd)
	})

function slug(s) {
  return s.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
}