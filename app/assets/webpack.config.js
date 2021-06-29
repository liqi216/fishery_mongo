const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
  	mainprocess:['./javascript/process.js',],
    //accwizardjs:'./javascript/accwizard.js',
    //countyHeatChart:'./javascript/countyHeatChart.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  plugins: [
  	 new CleanWebpackPlugin(['dist']),
     new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            'Popper': 'popper.js',
            'Waves': 'node-waves'
        })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
	  loaders: [       
    ]
  }
};