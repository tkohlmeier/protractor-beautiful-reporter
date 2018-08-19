//jshint strict: false
module.exports = function(config) {
    config.set({
        basePath: './lib',
        // '../node_modules/angular/angular.js',
        // '../node_modules/angular-mocks/angular-mocks.js',
        // './**/*.js'
        files: [
            '../node_modules/angular/angular.js',
            '../node_modules/angular-mocks/angular-mocks.js',
            './assets/jquery.min.js',
            './assets/bootstrap.min.js',
            './assets/buttons.js',
            './app.js',
            './app_test.js'
        ],


        autoWatch: true,

        frameworks: ['jasmine'],
        reporters:[
            'spec'
        ],

        browsers: ['PhantomJS'],

        plugins: [
            'karma-spec-reporter',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-jasmine'
        ]

    });
};
