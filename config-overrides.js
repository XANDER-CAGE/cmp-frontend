module.exports = function override(config, env) {
    const loaders = config.resolve
    loaders.fallback = {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve('stream-browserify'),
        process: require.resolve('process/browser'),
        buffer: require.resolve('buffer/'),
    };
    
    // Добавляем полифиллы
    config.plugins = [
        ...config.plugins,
        new require('webpack').ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ];
    
    return config;
}