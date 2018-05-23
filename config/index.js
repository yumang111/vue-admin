// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')
const merge = require('webpack-merge')

const environment = {
  backtest: { // dev - 后台开发环境
    env: require('./backtest.env'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/homeworkstation/sop-front/',
  },
  test: {
    env: require('./test.env'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/homeworkstation/sop-front/',
  },
  pre: {
    env: require('./pre.env'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/homeworkstation/sop-front/',
  },
  prod: {
    env: require('./prod.env'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '//static.fdc.com.cn/sop-front/',
    productionSourceMap: false
  }
}

module.exports = {
  build: merge({

    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/sop-front/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }, environment[process.env.npm_lifecycle_event]),
  dev: {
    env: require('./dev.env'),
    port: 8681,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/homebaseaction': {
        target: 'http://test.homebase.fdc.com.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/homebaseaction': '/homebaseaction'
        }
      },
      '/homeworkstation': {
        target: 'http://esf.basetest.fdc.com.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/homeworkstation': '/homeworkstation'
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
