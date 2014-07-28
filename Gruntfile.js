// Generated on 2014-06-15 using generator-sjeiti 0.0.1
/* global module, require */
module.exports = function (grunt) {
	/* jshint strict: false */

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
	grunt.loadTasks('gruntTasks');

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

	var sFolderSrc = 'src'
		,sFolderBuild = 'build'
		,sFolderDist = 'dist'
	;

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')

		// watchers
		,watch: {
			js: {
				files: ['src/js/*.js']
				,tasks: ['js']
				,options: {
					spawn: false
				}
			}
			,less: {
				files: ['src/style/*.less']
				,tasks: ['less:build']
				,options: {
					spawn: false
				}
			}
			,root: {
				files: ['src/*']
				,tasks: ['copy:build']
				,options: {
					spawn: false
				}
			}
		}

		// Unit testing
		,qunit: {
			all: [sFolderSrc + '/test/*.html']
		}

		// Lint source files
		,jshint: {
			options: { jshintrc: '.jshintrc' },
			files: sFolderBuild+'/js/main.js'
		}

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
			,jsdoc: { src: ['docs/**'] }
		}

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

		,svgmin: {
			options: {
				plugins: [
				  { removeViewBox: false }
				  ,{ removeUselessStrokeAndFill: false }
				]
			}
			,dist: {
				files: [{
					expand: true
					,cwd: 'design/svgExport/'
					,src: ['*.svg']
					,dest: 'temp/svg/'
					,ext: '.svg'
				}]
			}
		}
		,svgIcons: {
		  main: {
			src: 'temp/svg/',
			dest: 'src/style/svgIcons.less'
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
			jsdoc: { command: 'jsdoc src/js/ -r -c jsdoc_template/jsdoc.conf.json -d docs --template jsdoc_template' }
			,release: { command: 'cordova build android --release' }
			,clean: { cwd: 'platforms/android/cordova/', command: 'node clean', output: true }
		}

		,renderPage: {
			main: {
				src: 'temp/svg/',
				dest: 'src/style/svgIcons.less'
			}
		}
	});

	grunt.registerTask('js',[
		'copy:js'
		,'qunit'
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
		,'bower'
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
	grunt.registerTask('jsdoc',[
		'clean:jsdoc'
		,'cli:jsdoc'
	]);
	grunt.registerTask('svg',[
		'svgmin'
		,'svgIcons'
		,'css'
	]);
	grunt.registerTask('default',[
		'build'
	]);

};