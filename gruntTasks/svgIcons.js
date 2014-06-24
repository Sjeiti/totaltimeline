
module.exports = function(grunt) {
	'use strict';
	grunt.registerMultiTask('svgIcons', 'Convert svg icons to less file', function() {
		var fs = require('fs')
			,sSrc = this.data.src
			,sLine = '.event.icon-name {	background-image: url(\'data:image/svg+xml;utf8,file\'); }\n'
			,sStrip = '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
			,sContents = ''
		;
		fs.readdirSync(sSrc).forEach(function(file){
			if (!fs.lstatSync(sSrc+file).isDirectory()) {
				sContents += sLine
					.replace('name',file.match(/_\w+/).pop().substr(1))
					.replace('file',fs.readFileSync(sSrc+file).toString().replace(/[\r\n\t]/g,'').replace(sStrip,''))
				;
			}
		});
		fs.writeFileSync(this.data.dest,sContents);
	});
};