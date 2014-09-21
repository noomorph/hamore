module.exports = function(config) {
    'use strict';

    config.set({
        basePath: '..',

        frameworks: ['mocha', 'requirejs'],

        files: [
            // sinon will be accessable from global context
            { pattern: 'node_modules/sinon/pkg/sinon.js', included: true },
            // allow to load any *.js from node_modules by karma web-server
            { pattern: 'node_modules/chai/chai.js', included: false},
            { pattern: 'node_modules/sinon-chai/lib/sinon-chai.js', included: false},
            { pattern: 'node_modules/mocha/mocha.js', included: false},
            { pattern: 'node_modules/requirejs/require.js', included: false},
            { pattern: 'app/scripts/**/*.js',  included: false},
            { pattern: 'test/unit/**/*.js', included: false },
            { pattern: 'test/test-main.js', included: true }
        ],

        // list of files to exclude
        exclude: [
            'app/scripts/main.js'
        ],

        preprocessors: {
            'app/scripts/**/*.js': ['coverage']
        },

        // 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['coverage', 'spec'],

        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/'
        },

        // [ LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG ]
        logLevel: config.LOG_INFO,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['PhantomJS'],
        port: 9876,
        colors: true,
        autoWatch: true,
        captureTimeout: 60000,
        singleRun: false
    });
};
