module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
    devServer: {
        open: true,
        // host:"debug.dir",
        port:8080,
        disableHostCheck: true,
    },
    productionSourceMap:false
}