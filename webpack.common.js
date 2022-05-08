const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const glob = require('glob')

const isProduction = process.env.NODE_ENV === 'production'
const srcPath = path.join(__dirname, 'src')

function setMPA() {
  const entrys = {}
  const htmlWebpackPlugins = []

  const files = glob.sync(path.join(__dirname, '/src/entrys/*.tsx'))
  files?.forEach((entry) => {
    const fileName = entry.match(/entrys\/(.*).tsx/)[1]
    entrys[fileName] = entry
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: `${fileName}.html`,
        filename: `${fileName}.html`,
        chunks: ['vendors', 'commons', fileName],
        inject: 'body',
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJs: true,
          removecomment: true
        }
      })
    )
  })
  return {
    entrys,
    htmlWebpackPlugins
  }
}

const { entrys, htmlWebpackPlugins } = setMPA()

let rules = []
const threadLoader = {
  loader: 'thread-loader',
  options: {
    workers: 3
  }
}
if (isProduction) {
  rules = [
    {
      test: /\.(js|jsx)$/i,
      include: path.resolve('src'),
      use: [threadLoader, { loader: 'babel-loader', options: { cacheDirectory: true } }]
    },
    {
      test: /\.(ts|tsx)$/i,
      include: path.resolve('src'),
      use: [
        threadLoader,
        {
          loader: 'ts-loader',
          options: {
            happyPackMode: true, //ts-loader开启 thread-loader 需 打开 happyPackMode...
            transpileOnly: true,
            compilerOptions: {
              noEmit: false
            }
          }
        }
      ],
      include: srcPath,
      exclude: /node_modules/
    }
  ]
} else {
  rules = [
    {
      test: /\.(js|jsx)$/i,
      loader: 'babel-loader'
    },
    {
      test: /\.(ts|tsx)$/i,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        compilerOptions: {
          noEmit: false
        }
      }
    }
  ]
}
rules.push({
  test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
  type: 'asset'
})

const config = {
  entry: entrys,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js'
  },
  cache: {
    type: 'filesystem' // 使用文件缓存
  },
  module: {
    rules
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin()
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ].concat(htmlWebpackPlugins),
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      // react: './node_modules/react/cjs/react.production.min.js',
      // 'react-dom': './node_modules/react-dom/cjs/react-dom.production.min.js',
      // 'react-runtime': './node_modules/react/cjs/react-jsx-runtime.production.min.js',
      // icons: './node_modules/@ant-design/icons',
      // '@': srcPath // @ 代表 src 路径
    },
    modules: [path.resolve(__dirname, 'node_modules')], // 减少搜索模块层级
    // mainFiles: ['main'],
    symlinks: !isProduction // 如果项目不使用 symlinks（例如 npm link 或者 yarn link），可以设置 resolve.symlinks: false，减少解析工作量。
  },
  optimization: {
    runtimeChunk: true,
    minimize: true,
    usedExports: true,
    splitChunks: {
      chunks: 'all', // 异步引入的库进行分离（默认），  initial： 同步引入的库进行分离， all：所有引入的库进行分离（推荐）
      minSize: 20000, // 抽离的公共包最小的大小，单位字节
      minRemainingSize: 0, // 最大的大小
      minChunks: 1, // 资源被使用的最小次数(在多个页面使用到)
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          name: 'vendors'
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
          name: 'commons'
        }
      }
    }
  },
  stats: 'errors-only'
}

// optimization: {
//   splitChunks: {
//     // async：异步引入的库进行分离（默认），  initial： 同步引入的库进行分离， all：所有引入的库进行分离（推荐）
//     chunks: 'async',
//     minSize: 30000, // 抽离的公共包最小的大小，单位字节
//     maxSize: 0, // 最大的大小
//     minChunks: 1, // 资源使用的次数(在多个页面使用到)， 大于1， 最小使用次数
//     maxAsyncRequests: 5,  // 并发请求的数量
//     maxInitialRequests: 3, // 入口文件做代码分割最多能分成3个js文件
//     automaticNameDelimiter: '~', // 文件生成时的连接符
//     automaticNameMaxLength: 30, // 自动自动命名最大长度
//     name: true, //让cacheGroups里设置的名字有效
//     cacheGroups: { //当打包同步代码时,上面的参数生效
//       vendors: {
//         test: /[\\/]node_modules[\\/]/,  //检测引入的库是否在node_modlues目录下的
//         priority: -10, //值越大,优先级越高.模块先打包到优先级高的组里
//         filename: 'vendors.js'//把所有的库都打包到一个叫vendors.js的文件里
//       },
//       default: {
//         minChunks: 2, // 上面有
//         priority: -20,  // 上面有
//         reuseExistingChunk: true //如果一个模块已经被打包过了,那么再打包时就忽略这个上模块
//       }
//     }
//   }
// }

module.exports = () => config
