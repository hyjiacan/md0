const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

const fileLoader = {
  test: /\.(md|gif|png|jpg)$/,
  use: [{
    loader: 'file-loader',
    options: {
      publicPath: './',
      name: '[name].[ext]'
    }
  }]
}

const babelLoader = {
  test: /\.js$/,
  exclude: /(node_modules|dist|docs)/,
  loader: 'babel-loader'
}


const devConfig = {
  entry: './demo/index.js',
  devtool: 'source-map',
  // output: {
  //   path: path.resolve(__dirname, 'docs'),
  //   filename: '[name].js'
  // },
  devServer: {
    // contentBase: './',
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
    }, fileLoader]
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
    filename: '[name].js',
    library: 'md0',
    libraryExport: 'default',
    libraryTarget: 'umd',
    globalObject: 'this'
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
    }, babelLoader]
  },
  optimization: {
    // minimize: false
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
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  module: {
    rules: [{
      test: /\.less$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'less-loader'
      ]
    }, fileLoader, babelLoader]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new HtmlWebpackPlugin({
      title: 'md0',
      template: path.resolve(__dirname, 'demo/index.html')
    })
  ]
}


module.exports = (env, argv) => {
  if (argv.serve) {
    return devConfig
  }

  if (argv.dist) {
    return distConfig
  }

  if (argv.docs) {
    return docsConfig
  }

  return distConfig
}
