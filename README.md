# Total timeline

* [Project setup](#project-setup)
* [Version control](#version-control)

## Project setup

The project is a custom auto-generated setup through Yeoman.
A clean mobile-first scaffold.


## Version control

url: https://xp-dev.com/git/totaltimeline
trac: ...


## Build

The build consist of two main operations:
`grunt build` compiles and copies the source files uncompressed to the `build` folder
`grunt dist` copies and minifies the build into the `dist` folder

When `grunt build` has run once you can suffice with `grunt css` and  `grunt js` for changes in less- and javascript files.

The Grunt tasks are:

 * js
 * css
 * build
 * dist
 * updatefont (used to update less and icon font files)
 * default


### Versioning

Grunt-version-git is added to automatically add a revision number based on the number of commits (check the gruntfile to see which files it is applied to).
To bump the major or minor version do: `grunt version_git --minor=1`


### Iconfont

The frontend uses an icon font generated through [Icomoon](http://icomoon.io/app/).
You can update it by using the json file located at `src/icons/font/selection.json`. After using the json file once the font should be cached on your machine in a cookie.
If you update the font, download the zip and unpack it to `src/icons/font`.
Then run `grunt updatefont` to copy the fontfiles and update `src/style/iconfont.less`.


#### Notes

Even though grunt-google-cdn is installed it is not used in the build because it doesn't seem to be working anymore. It is left in there for possible future fixes and implementation.

## Documentation

Documentation is generated with jdoc3, see: https://github.com/jsdoc3/jsdoc.

Grunt versions failed to install so we use a globally installed jsdoc as so:
jsdoc src/js/ -r -c jsdoc_template/jsdoc.conf.json -d docs
