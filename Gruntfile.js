// Generated on 2014-06-15 using generator-sjeiti 0.0.1
/* global module, require */
module.exports = function (grunt) {
	/* jshint strict: false */

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
	grunt.loadTasks('gruntTasks');

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

	var fs = require('fs')
		,glob = require('glob')
		// config
		,sFolderSrc = 'src'
		,sFolderBuild = 'build'
		,sFolderDist = 'dist'
		,sBanner = getBanner(sFolderSrc+'/js/totaltimeline.js')
	;

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')

        // Automatically inject Bower components into the HTML file
		,bower: {
			main: {
				json: 'bower.json',
				bowerrc: '.bowerrc',
				dest: 'src/index.html'
			}
		}

		// Clean folders
		,clean: {
			build: { src: [sFolderBuild+'/**'] }
			,dist: { src: [sFolderDist+'/**'] }
		}

        // Automatically inject Bower components into the HTML file
        ,bowerInstall: {
            app: {
                src: [sFolderSrc+'/index.html']
        	}
        }

//		// Replace Google CDN references (not working though)
//		,cdnify: {
//			options: {
//				cdn: require('google-cdn-data')
//			}
//			,dist: {
//				html: [sFolderDist+'/*.html']
//			}
//		}

		// Compile less files
		,less: {
			build: {
				options: { compress: false }
				,src: [sFolderSrc+'/style/screen.less']
				,dest: sFolderBuild+'/style/screen.css'
			}
			,dist: {
				options: { compress: true }
				,src: [sFolderSrc+'/style/screen.less']
				,dest: sFolderDist+'/style/screen.css'
			}
		}

//		// Include files into other files
//		,include_file: {
//			main: {
//				cwd: sFolderSrc+'/js/',
//				src: ['main.js'],
//				dest: sFolderBuild+'/js/'
//			}
//			,index: {
//				cwd: sFolderSrc+'/',
//				src: ['index.html'],
//				dest: sFolderBuild+'/'
//			}
//		}

		// Lint source files
		,jshint: {
			options: { jshintrc: '.jshintrc' },
			files: sFolderBuild+'/js/main.js'
		}

//		// Uglify stuff
//		,uglify: {
//			dist: {
//				options: {
//				  banner: sBanner
//				},
//				src: sFolderBuild+'/js/main.js',
//				dest: sFolderDist+'/js/main.js'
//			}
//		}

		// Usemin
		,useminPrepare: {
			html: sFolderBuild+'/index.html',
			options: {
//				root: sFolderBuild,
				dest: sFolderDist,
				flow: {
				  html: {
					steps: {
					  js: ['concat', 'uglifyjs']
					},
					post: {}
				  }
				}
			}
		},usemin: {
			html: [sFolderDist+'/{,*/}*.html'],
			options: {
//				assetsDirs: ['foo/bar','bar']
			}
		}

		// Copy all the things!
		,copy: {
			js: { // js files
				expand: true
				,cwd: sFolderSrc+'/js/'
				,src: ['**']
				,dest: sFolderBuild+'/js/'
				,filter: 'isFile'
			}
			,vendor: { // js files
				expand: true
				,cwd: sFolderSrc+'/vendor/'
				,src: ['**']
				,dest: sFolderBuild+'/vendor/'
				,filter: 'isFile'
			}
			,build: {
				files: [
					{ // htaccess
						expand: true
						,cwd: sFolderSrc+'/'
						,src: ['.htaccess']
						,dest: sFolderBuild+'/'
						,filter: 'isFile'
						,dot: true
					},
					{ // index
						expand: true
						,cwd: sFolderSrc+'/'
						,src: ['index.html']
						,dest: sFolderBuild+'/'
						,filter: 'isFile'
					},
					{ // fonts
						expand: true
						,cwd: sFolderSrc+'/style/fonts/'
						,src: ['**']
						,dest: sFolderBuild+'/style/fonts/'
						,filter: 'isFile'
					},
					{ // vendor files
						expand: true
						,cwd: sFolderSrc+'/vendor/'
						,src: ['**']
						,dest: sFolderBuild+'/vendor/'
						,filter: 'isFile'
					},
					{ // js files
						expand: true
						,cwd: sFolderSrc+'/js/'
						,src: ['**']
						,dest: sFolderBuild+'/js/'
						,filter: 'isFile'
					},
					{ // data folder
						expand: true
						,cwd: sFolderSrc+'/data/'
						,src: ['**']
						,dest: sFolderBuild+'/data/'
						,filter: 'isFile'
					},
					{ // images and stuff
						expand: true
						,cwd: sFolderSrc+'/style/'
						,src: ['**']
						,dest: sFolderBuild+'/style/'
						,filter: function(src){
							return ['less','css','bootstrap'].indexOf(src.split('.').pop())===-1;
						}
					}
				]
			}
			,dist: {
				files: [
					{ // htaccess
						expand: true
						,cwd: sFolderSrc+'/'
						,src: ['.htaccess']
						,dest: sFolderDist+'/'
						,filter: 'isFile'
						,dot: true
					},
					{ // index
						expand: true
						,cwd: sFolderBuild+'/'
						,src: ['index.html']
						,dest: sFolderDist+'/'
						,filter: 'isFile'
					},
					{ // fonts
						expand: true
						,cwd: sFolderSrc+'/style/fonts/'
						,src: ['**']
						,dest: sFolderDist+'/style/fonts/'
						,filter: 'isFile'
					},
					{ // data folder
						expand: true
						,cwd: sFolderSrc+'/data/'
						,src: ['**']
						,dest: sFolderDist+'/data/'
						,filter: 'isFile'
					},
					{ // images and stuff
						expand: true
						,cwd: sFolderSrc+'/style/'
						,src: ['**']
						,dest: sFolderDist+'/style/'
						,filter: function(src){
							return ['less','css','bootstrap'].indexOf(src.split('.').pop())===-1;
						}
					}
				]
			}
			,font: {
				files: [
					{
						expand: true,
						cwd: sFolderSrc+'/styles/fonts/',
						src: ['*'],
						dest: sFolderDist+'/styles/fonts/',
						filter: 'isFile'
					}
				]
			}
			,updatefont: {
				files: [
					{
						expand: true,
						cwd: 'icons/font/fonts/',
						src: ['*'],
						dest: sFolderSrc+'/styles/fonts/',
						filter: 'isFile'
					}
					,{
						expand: true,
						cwd: 'icons/font/',
						src: ['style.css'],
						dest: sFolderSrc+'/styles/',
						rename: function (dest) {//, src
							return dest + 'iconfont.less';
						}
					}
				]
			}
		}

		,svgIcons: {
		  main: {
			src: 'design/svgExport/',
			dest: 'src/style/svgIcons.less'
		  }
		}

		,fontcss2src: {
		  updatefont: {
			src: 'icons/font/style.css',
			dest: sFolderSrc+'/style/iconfont.less'
		  }
		}

		,version_git: {
			main: {
				files: {src: [
				  'package.json',
				  'bower.json',
				  sFolderSrc+'/js/totaltimeline.js'
				]}
			}
		}

		,cli: {
			jsdoc: { command: 'jsdoc src/js/ -r -c jsdoc_template/jsdoc.conf.json -d docs' }
			,release: { command: 'cordova build android --release' }
			,clean: { cwd: 'platforms/android/cordova/', command: 'node clean', output: true }
		}
	});


	/**
	 * Convert initial jsdoc comments to object
	 * @param source source file
	 * @returns {{title: *}} jsdoc as object
	 */
	function getBanner(source){
		var sSource = fs.readFileSync(source).toString();
		return sSource.match(/\/\*\*([\s\S]*?)\*\//g)[0];
	}


	/**
	 * Convert initial jsdoc comments to object
	 * @param source source file
	 * @returns {{title: *}} jsdoc as object
	 */
	function readBanner(source){
		var sSource = fs.readFileSync(source).toString()
			,sBanner = sSource.match(/\/\*\*([\s\S]*?)\*\//g)[0]
			,aLines = sBanner.split(/[\n\r]/g)
			,aMatchName = sBanner.match(/(\s?\*\s?([^@]+))/g)
			,sName = aMatchName.shift().replace(/[\/\*\s\r\n]+/g,' ').trim()
			,oBanner = {title:sName};
		for (var i = 0, l = aLines.length; i<l; i++) {
			var sLine = aLines[i]
				,aMatchKey = sLine.match(/(\s?\*\s?@([^\s]*))/);
			if (aMatchKey) {
				var sKey = aMatchKey[2];
				oBanner[sKey] = sLine.split(sKey).pop().trim();
			}
		}
		return oBanner;
	}

	/**
	 * Processes icomoon font package to less files
	 */
	grunt.registerMultiTask('fontcss2src', '', function() {
		var fs = require('fs'),
      sSrc = fs.readFileSync(this.data.src).toString();
    sSrc = sSrc.replace(/url\(\'/g,'url(\'/styles/');
		fs.writeFileSync(this.data.dest,sSrc);
		grunt.log.writeln('updated '+this.data.dest+' with font data');
	});

	grunt.registerTask('js',[
		'copy:js'
	]);
	grunt.registerTask('css',[
		'less:build'
	]);
	grunt.registerTask('vendor',[
		'copy:vendor'
		,'bower'
	]);

	grunt.registerTask('build',[
		'clean:build'
		,'bowerInstall'
		//,'include_file'
		,'copy:build'
		,'less:build'
	]);
	grunt.registerTask('dist',[
		'clean:dist'
		,'version_git'
		//,'build'
		,'jshint'
		,'less:dist'
		,'copy:dist'
        //,'cdnify'
		,'useminPrepare'
		,'concat'
		,'uglify'
		,'usemin'
	]);
	grunt.registerTask('updatefont',[
		'copy:updatefont'
		,'fontcss2src'
	]);
	grunt.registerTask('jsdoc',[
		'cli:jsdoc'
	]);
	grunt.registerTask('default',[
		'build'
	]);

};