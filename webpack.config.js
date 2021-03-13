// const path = require('path');
//
// module.exports = {
//
//   entry: {
//     "js/index": './src/js/index.js',
//     serviceWorker: './src/serviceWorker.js'
//   },
//   output: {
//     path: path.resolve(__dirname, 'dist/'),
//     filename: "[name].js"
//   },
//
//   /*entry: './src/js/index.js',
//   output: {
//     filename: 'index.js',
//     path: path.resolve(__dirname, 'dist/js')
//   },*/
//
//   devtool: 'source-map',
//   module: {
//     loaders: [
//       {
//         test: /\.js$/,
//         loader: 'babel-loader',
//         exclude: /node_modules/,
//         query: {
//           presets: ['es2015', 'stage-0']
//         }
//         // include: path.join(__dirname, 'src/js'),
//         // babelrc: false,
//         // query: {
//         //   presets: ['es2015'],
//         //   plugins: [
//         //     ["transform-object-rest-spread"],
//         //     ["transform-react-display-name"],
//         //   ],
//         // }
//       }
//     ]
//   }
// };

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const lessPluginGlob = require('less-plugin-glob')
const {default:WatchExternalFilesPlugin} = require('webpack-watch-files-plugin')
const fileName = '[name]-[hash].[ext]'
module.exports = env => {

  const isProduction = !!env&&env.production
  // const isDevelopment = !!env&&env.development
  // const isStaging = !!env&&env.staging
  const mode = isProduction?'production':'development'

  return {
    mode
    ,entry: './src/js/index.js'
    ,output: {
      filename: 'js/index.js'
      ,path: path.resolve(__dirname,'dist')
    }
    ,devtool: 'source-map'
    ,module: {
      rules: [{
          test: /\.less$/
          ,use: [
              'style-loader' // creates style nodes from JS strings
              ,'css-loader' // translates CSS into CommonJS
              // ,'less-loader' // compiles Less to CSS, using Node Sass by default
              ,{
                loader: 'less-loader'
                ,options: {
                  // plugins: [new lessPluginGlob()]
                  // ,paths: [path.resolve(__dirname, 'src')] // This is the important part!
									lessOptions: {
                  	plugins: [lessPluginGlob]
										,paths: [path.resolve(__dirname, 'src')],
									}
                }
              }
          ]
      },{
        test: /\.(log|frag|vert|txt|css)/
        ,use: [{
            loader: 'raw-loader'
            ,options: {
                name: `data/${fileName}`
            }
        }]
      },{
        test: /\.(mp3|mp4)$/
        ,use: [{
            loader: 'file-loader'
            ,options: {
                name: `media/${fileName}`
            }
        }]
      },{
        test: /\.(eot|woff|woff2|ttf|png|jp(e*)g|svg)$/
        ,use: [{
            loader: 'url-loader'
            ,options: {
                limit: 8000 // Convert images < 8kb to base64 strings
                ,name: `img/${fileName}`
            }
        }]
      },{
        test: /\.js$/
        ,exclude: /node_modules/
        ,use: {
          loader: 'babel-loader'
          ,options: { babelrc: true }
        }
      }]
    }
    ,plugins: [
      new CopyWebpackPlugin({patterns:[
          // { from: 'src/*', to: './', /*flatten: true,*/ globOptions: {dot: true}}
          { from: 'src/*', to: '[name][ext]', /*flatten: true,*/ globOptions: {dot: true}}
          ,{ from: 'src/fonts', to: './fonts' }
          ,{ from: 'src/static', to: './static' }
      ]})
      ,new webpack.DefinePlugin({
        _VERSION: JSON.stringify(require('./package.json').version)
        ,_ENV: JSON.stringify(env||{})
      })
      // ,new WatchExternalFilesPlugin ({
      //   files: ['src/js/**/*.less'] // see screen.less with glob import (which doesn't work with watcher)
      // })

    ]
  }
}
