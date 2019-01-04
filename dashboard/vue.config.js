// vue.config.js
module.exports = {
  css: {
    sourceMap: true,
  },
  lintOnSave: true,
  // output built static files to Laravel's public dir.
  // note the "build" script in package.json needs to be modified as well.
  outputDir: '../public/admin',

  // Change build paths for production
  indexPath: process.env.NODE_ENV === 'production'
      ? '../../resources/views/admin/index.blade.php'
      : 'index.html',
  baseUrl: process.env.NODE_ENV === 'production'
      ? '/admin/'
      : '/',

  devServer: {
    proxy: {
      '/api': {
        target: 'http://crypto.loc',
        ws: true,
        changeOrigin: true
      }
    }
  }
};
