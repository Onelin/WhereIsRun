const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')

const { merge } = require('webpack-merge')
const path = require('path')

const config = require('./webpack.common')()

const scriptsMap = {
  report: 'report',
  watch: 'watch'
}

const speed = new SpeedMeasureWebpackPlugin()

config.plugins.push(new CleanWebpackPlugin(), function () {
  this.hooks.done.tap('tap', (stats) => {
    if (stats.errors && stats.errors.length && process.argv.indexOf('--watch') === -1) {
      console.log('build error')
      process.exit(1)
    }
  })
})

config.module.rules.push(
  {
    test: /\.less$/i,
    include: path.resolve('src'),
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
  },
  {
    test: /\.css$/i,
    include: path.resolve('src'),
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
  }
)

const prodConfig = {
  mode: 'production'
}

if (process.env.npm_lifecycle_event === scriptsMap.watch) {
  config.devtool = 'cheap-source-map'
} else if (process.env.npm_lifecycle_event === scriptsMap.report) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  config.plugins.push(new BundleAnalyzerPlugin.BundleAnalyzerPlugin())
}

const swpConfig = speed.wrap(merge(config, prodConfig))
swpConfig.plugins?.push(
  new MiniCssExtractPlugin({ filename: '[name]_[contenthash:8].css' }),
  new webpack.DllReferencePlugin({
    manifest: require('./build/library/library.json'),
    context: __dirname
  })
)
// const mergeConfig = merge(config, prodConfig)
// mergeConfig.plugins?.push(new MiniCssExtractPlugin({ filename: '[name]_[contenthash:8].css' }))
// module.exports = mergeConfig
module.exports = swpConfig
