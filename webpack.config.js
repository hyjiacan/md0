const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

const devConfig = {
  entry: './demo/index.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].js'
  },
  devServer: {
    contentBase: './demo',
    hot: true
  },
  module: {
    rules: [{
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        'less-loader'
      ]
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'md0',
      template: path.resolve(__dirname, 'demo/index.html')
    })
  ]
}

const distConfig = {
  entry: {
    md0: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.less$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'less-loader'
      ]
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
}

const docsConfig = {
  entry: {
    md0: './demo/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.less$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'less-loader'
      ]
    }, {
      test: /\.(md|gif)$/,
      use: ['file-loader']
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
}


module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    return devConfig
  }

  if (argv.mode === 'production') {
    return distConfig
  }

  if (argv.mode === 'none') {
    return docsConfig
  }

  return distConfig
}
