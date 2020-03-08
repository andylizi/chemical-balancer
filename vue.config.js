const WebpackCdnPlugin = require('webpack-cdn-plugin');

/**
 *  @typedef { import("@vue/cli-service").ProjectOptions } Options
 *  @type { Options }
 */
module.exports = {
    publicPath: './',
    filenameHashing: false,
    css: {
        sourceMap: true
    },
    chainWebpack: config => {
        const isProd = process.env.NODE_ENV === 'production';

        config.plugin('cdn')
            .use(WebpackCdnPlugin, [{
                prodUrl: "https://cdn.jsdelivr.net/npm/:name@:version/:path",
                publicPath: '',
                modules: [
                    { name: 'vue', var: 'Vue', path: 'dist/vue.runtime.js' }
                ]
            }]);

        config.when(isProd, 
            config => config.devtool('nosources-source-map'),
            config => config.devtool('source-map'));
    }
};