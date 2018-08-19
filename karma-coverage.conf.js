//jshint strict: false
module.exports = function (config) {
    config.set({
        basePath: './',
        // '../node_modules/angular/angular.js',
        // '../node_modules/angular-mocks/angular-mocks.js',
        // './**/*.js'
        files: [
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/babel-polyfill/dist/polyfill.js',
            'lib/assets/jquery.min.js',
            'lib/assets/bootstrap.min.js',
            'lib/assets/buttons.js',
            './examples/reports/19-8-2018/app.js',
            'tests/app/test_data.js',
            'tests/app/app_test.js'
        ],
        preprocessors:config.cc?{
            './examples/reports/19-8-2018/app.js': ['coverage']
        }:{},

        frameworks: ['jasmine'],
        reporters: [
           'progress', 'coverage'
        ],

        // Configure code coverage reporter
        coverageReporter: {
            dir: 'tmp/coverage',
            subdir: 'report',
            reporters: [
                {type: 'text-summary'},
                {type: 'html'}
            ]
        },
        browsers: ['PhantomJS'],

        plugins: [
            'karma-spec-reporter',
            'karma-coverage',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-jasmine'
        ]

    });
};
