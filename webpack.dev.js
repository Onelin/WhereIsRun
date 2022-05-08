const NodePolyfillWebpackPlugin = require('node-polyfill-webpack-plugin')
const EslintWebpackPlugin = require('eslint-webpack-plugin')
const { merge } = require('webpack-merge')

const config = require('./webpack.common')()

const devConfig = {
  devServer: {
    open: false,
    host: 'localhost',
    historyApiFallback: true,
    compress: true,
    // https: true,
    proxy: {
      // 代理
      '/api': {
        target: 'https://mock.mengxuegu.com/mock/626ba74c1e3d7470073a2286/',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api': '' }
      }
    }
  }
  // optimization: {
  //   moduleIds: 'named'
  // },
}

const styleOptions = {
  loader: 'style-loader',
  options: { injectType: 'singletonStyleTag' }
}

config.module.rules.push(
  {
    test: /\.less$/i,
    use: [styleOptions, 'css-loader', 'postcss-loader', 'less-loader']
  },
  {
    test: /\.css$/i,
    use: [styleOptions, 'css-loader', 'postcss-loader']
  }
)

config.plugins.push(new NodePolyfillWebpackPlugin(), new EslintWebpackPlugin())
config.mode = 'development'
config.devtool = 'eval-cheap-module-source-map'

module.exports = merge(config, devConfig)
