module.exports = function(grunt) {
'use strict';

	grunt.registerMultiTask('renderPage', 'Render pages with PhantomJS', function(){

		var done = this.async()
			,exec = require('child_process').exec
			,fs = require('fs')
			,mkdirp = require('mkdirp')
			,builder = require('xmlbuilder')
			//
			,data = this.data
			,sBaseUri = data.baseUri||'http://localhost.ttl/'
			,sTargetPath = data.dest||'render/'
			,aPages = data.pages//['spiral-galaxy','milky-way']
			,bRenderImage = data.renderImage||false
			//
			,iPages = aPages?aPages.length:0
			,iPage = 0
			//
			,sSitemap = 'sitemap.xml'
			,oSitemap = builder.create('urlset')
				.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
				.att('xmlns:image', 'http://www.google.com/schemas/sitemap-image/1.1')
			//
			,sUrl
			,sName
			,sTarget
		;

		// check if target path exists
		mkdirp(sTargetPath,function (err) {
			err&&console.error(err);
		});

		if (aPages===undefined) { // get list of pages
			exec('phantomjs src/js/phantomPages.js '+sBaseUri, handleExecPhantomPages);
		} else { // start rendering the first page
			nextPage();
		}


		function handleExecPhantomPages(error, stdout){
			aPages = stdout.replace(/[\n\r]/g,'').split(',');
			iPages = aPages.length;
			console.log('Found',iPages,'pages.'); // log
			nextPage();
		}

		function handleExecPhantomRender(error, stdout){//, stderr){

			// add to sitemap
			oSitemap
				.ele('url')
				.ele('loc').txt(sUrl).up() // <loc>http://test.fcwalvisch.com/</loc>
				// <lastmod>2014-05-28T13:38:11+00:00</lastmod>
				.ele('changefreq').txt('weekly').up() // <changefreq>weekly</changefreq>
				.ele('priority').txt(1).up() // <priority>1</priority>
				//<image:image>
				//	<image:loc>http://test.fcwalvisch.com/wp-content/uploads/home-photo1.jpg</image:loc>
				//	<image:caption>home photo</image:caption>
				//</image:image>
				.up()
			;

			// save the file
			fs.writeFile(sTargetPath+sTarget, stdout, handleWriteHTML);

		}

		function handleWriteHTML(err){
			console.log(err||'file '+(iPages-iPage)+' \''+sTarget+'\' saved');
			whatNext();
		}

		function handleWriteSitemap(err){
			console.log(err||'file \''+sSitemap+'\' saved');
			done();
		}

		function whatNext(){
			iPage++;
			if (iPage>=iPages) {
				fs.writeFile(sTargetPath+sSitemap, oSitemap.toString(), handleWriteSitemap);
			} else {
				nextPage();
			}
		}

		function nextPage(){
			sUrl = sBaseUri+aPages[iPage];
			sName = sUrl.split('/').pop();
			sTarget = sName+'.html';
			var aExec = ['phantomjs','src/js/phantomRender.js',sUrl];
			bRenderImage&&aExec.push(sTargetPath);
			exec(aExec.join(' '), handleExecPhantomRender);
		}
	});
};
/*
//sitemap.txt
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>http://www.example.com/foo.html</loc>
    <image:image>
       <image:loc>http://example.com/image.jpg</image:loc>
    </image:image>
    <video:video>
      <video:content_loc>
        http://www.example.com/video123.flv
      </video:content_loc>
      <video:player_loc allow_embed="yes" autoplay="ap=1">
        http://www.example.com/videoplayer.swf?video=123
      </video:player_loc>
      <video:thumbnail_loc>
        http://www.example.com/thumbs/123.jpg
      </video:thumbnail_loc>
      <video:title>Grilling steaks for summer</video:title>
      <video:description>
        Get perfectly done steaks every time
      </video:description>
    </video:video>
  </url>
</urlset>

//sitemap_index.xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="//test.fcwalvisch.com/main-sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<sitemap>
		<loc>http://test.fcwalvisch.com/post-sitemap.xml</loc>
		<lastmod>2014-05-28T13:40:20+00:00</lastmod>
	</sitemap>
	<sitemap>
		<loc>http://test.fcwalvisch.com/page-sitemap.xml</loc>
		<lastmod>2014-07-11T08:43:49+00:00</lastmod>
	</sitemap>
</sitemapindex>

//page-sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="//test.fcwalvisch.com/main-sitemap.xsl"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>http://test.fcwalvisch.com/</loc>
		<lastmod>2014-05-28T13:38:11+00:00</lastmod>
		<changefreq>weekly</changefreq>
		<priority>1</priority>
		<image:image>
			<image:loc>http://test.fcwalvisch.com/wp-content/uploads/home-photo1.jpg</image:loc>
			<image:caption>home photo</image:caption>
		</image:image>
	</url>
	<url>
		<loc>http://test.fcwalvisch.com/news/</loc>
		<lastmod>2014-05-09T09:57:46+00:00</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>
	<url>
		<loc>http://test.fcwalvisch.com/showreel/</loc>
		<lastmod>2014-06-25T14:24:41+00:00</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>
	<url>
		<loc>http://test.fcwalvisch.com/nl/isdn-2/</loc>
		<lastmod>2014-06-26T12:03:14+00:00</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>
	<url>
		<loc>http://test.fcwalvisch.com/nl/uitrusting-muziek-studio/</loc>
		<lastmod>2014-06-26T12:06:28+00:00</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>
	<url>
		<loc>http://test.fcwalvisch.com/nl/en-het_is_showtime/</loc>
		<lastmod>2014-06-26T12:07:47+00:00</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>
</urlset>




*/