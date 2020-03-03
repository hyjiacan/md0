const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

const config = {
  module: {
    rules: [{
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        'less-loader'
      ]
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}


module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    Object.assign(config, {
      entry: './demo/index.js',
      devtool: 'source-map',
      devServer: {
        contentBase: './demo',
        hot: true
      },
      plugins: [
        new CleanWebpackPlugin(), new HtmlWebpackPlugin({
          title: 'md0',
          template: path.resolve(__dirname, 'demo/index.html')
        })
      ]
    })
  }

  if (argv.mode === 'production') {
    Object.assign(config, {
      entry: './src/index.js',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'md0.js'
      }
    })
  }

  return config
}
