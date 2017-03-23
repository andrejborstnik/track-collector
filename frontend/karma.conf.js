//
// Karma configuration.
//


module.exports = function (config) {
    config.set({
        basePath: '',

        frameworks: ['mocha', 'browserify'],

        browserify: {
            debug: true,
            transform: [
                ['babelify', {plugins: ['babel-plugin-espower']}],
                ['configurify', {pattern: "**/config.js"}]
            ],
            paths: ['./src', './']
        },

        files: [
            'src/test/**/*.js'
        ],

        exclude: [],

        preprocessors: {
            'src/test/**/*.js': 'browserify'
        },

        reporters: ['mocha'],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,
        autoWatch: true,

        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
    })
}
