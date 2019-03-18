var path = require('path');
var SRC_DIR = path.join(__dirname, 'main/react');
var DIST_DIR = path.join(__dirname, 'main/public');

module.exports = {
  entry: `${SRC_DIR}/app.jsx`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
  },
  devServer: {
    inline: false,
    contentBase: "/public",
  },
  module : {
    rules : [
      {
        test : /\.jsx?/,
        include : SRC_DIR,
        loader : 'babel-loader',      
        query: {
          presets: ['@babel/react', '@babel/env']
       }
      }
    ]
  }
};