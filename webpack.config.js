
let libraryName = 'ScreenshotReporter';

module.exports = {
    entry: ['babel-polyfill', './app/reporter.js'],
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },

    output: {
        filename: 'index.js',
        library: libraryName,
        libraryTarget: 'commonjs-module',
        umdNamedDefine: true
    },

    module: {
        loaders: [
            {
                test: /reporter\.js?$/,
                loader: 'babel-loader',
                /* look into .babelrc for additional options*/
                exclude: /node_modules/
            }
        ]
    }
};
