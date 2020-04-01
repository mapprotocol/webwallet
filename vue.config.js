const path = require('path');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const cdn = {
  css: [
  ],
  js: [
    'https://files.marcopolo.link/script/vue.min.js',
    'https://files.marcopolo.link/script/axios.min.js',
    'https://files.marcopolo.link/script/vue-router.js',
    'https://unpkg.com/vuex@3.1.3/dist/vuex.js'
  ]
};
module.exports = {
  // publicPath:'/',
  // outputDir: '../public/m',
  // assetsDir:'',
  // indexPath:'../view/index.html',
  lintOnSave: false,
  filenameHashing: false,
  productionSourceMap: true,
  //publicPath: process.env.NODE_ENV === 'production' ? '/vant-demo/' : '/'
  chainWebpack: config => {
    if (isProduction) {
      // preload
      // config.plugins.delete('preload');
      // config.plugins.delete('prefetch');
      // minimize
      config.optimization.minimize(true);
      // splitChunks
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendor: {
            chunks: 'all',
            test: /node_modules/,
            name: 'vendor',
            minChunks: 1,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 100,
          },
          common: {
            chunks: 'all',
            test: /[\\/]src[\\/]js[\\/]/,
            name: 'common',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 60
          },
          styles: {
            name: 'styles',
            test: /\.(sa|sc|c)ss$/,
            chunks: 'all',
            enforce: true,
          },
          runtimeChunk: {
            name: 'manifest'
          }
        }
      });
      //alias name
      // config.resolve.alias
      //     .set("@", resolve("src"))
      // inject cdn on production
      config.plugin('html')
        .tap(args => {
          args[0].title='Marcopolo';
          args[0].cdn = cdn;
          return args;
        });
    }else {
      config.plugin('html')
        .tap(args => {
          args[0].title='Marcopolo';
          return args;
        });
    }
  },
  configureWebpack: config => {
    if (isProduction) {
      // import from cdn
      config.externals = {
        'vue': 'Vue',
        'vuex': 'Vuex',
        'vue-router': 'VueRouter',
        'axios': 'axios'
      };

      // product...
      config.plugins.push(
        //remove console
        // new UglifyJsPlugin({
        //   uglifyOptions: {
        //     compress: {
        //       warnings: false,
        //       drop_debugger: true,
        //       drop_console: true,
        //       pure_funcs: ['console.log', 'console.info']
        //     },
        //   },
        //   sourceMap: false,
        //   parallel: true,
        // })
      );
    } else {
      // config for development...
    }
  },
  devServer: {
    proxy: {
      '/api':{
        target:'https://usersideapi.marcopay.org/',
        changeOrigin:true,
        pathRewrite:{
          '/api':''
        }
      },
    }
  },
};
