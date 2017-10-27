const path = require('path');

module.exports = {

  entry: {
    index: './src/js/index.js',
    serviceWorker: './src/js/serviceWorker.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: "[name].js"
  },


  /*entry: './src/js/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/js')
  },*/

  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0']
        }
        // include: path.join(__dirname, 'src/js'),
        // babelrc: false,
        // query: {
        //   presets: ['es2015'],
        //   plugins: [
        //     ["transform-object-rest-spread"],
        //     ["transform-react-display-name"],
        //   ],
        // }
      }
    ]
  }
};