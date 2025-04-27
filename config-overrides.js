const webpack = require('webpack');

module.exports = function override(config, env) {
    const loaders = config.resolve;
    loaders.fallback = {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve('stream-browserify'),
        process: require.resolve('process/browser.js'),
        buffer: require.resolve('buffer/'),
    };
    
    // Добавляем полифиллы
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            process: 'process/browser.js',
            Buffer: ['buffer', 'Buffer']
        })
    ];
    
    return config;
}