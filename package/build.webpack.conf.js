'use strict'
const path = require('path')
const webpack = require('webpack')

const webpackConfig = {
  entry: {
    'build' : path.resolve(__dirname, 'index.js')
  },
  output: {
    //根据CommonJs的规范进行打包
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
}

webpack(webpackConfig, error => {
  if(error) throw error
})
