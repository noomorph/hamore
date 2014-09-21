/* global requirejs */

(function() {
    'use strict';

    var baseUrl = '',
        specFiles = null,
        requirejsCallback = null;

    // if invoked in karma-runner environment
    if (typeof window !== 'undefined' && window.__karma__ !== undefined) {
        // Karma serves files from '/base'
        baseUrl = '/base';
        requirejsCallback = window.__karma__.start;

        // looking for *_spec.js files
        specFiles = [];
        for (var file in window.__karma__.files) {
            if (window.__karma__.files.hasOwnProperty(file)) {
                if (/.*\/test\/unit\/.+\.spec\.js$/.test(file)) {
                    specFiles.push(file);
                }
            }
        }
    }

    requirejs.config({
        baseUrl: baseUrl,

        paths: {
            'app': 'app/scripts',
            'sinon': 'node_modules/sinon/pkg/sinon',
            'chai': 'node_modules/chai/chai',
            'sinon-chai': 'node_modules/sinon-chai/lib/sinon-chai'
        },

        // ask Require.js to load these files (all our tests)
        deps: specFiles,

        // start test run, once Require.js is done
        callback: requirejsCallback
    });

    require(['sinon-chai', 'chai'], function (sinonChai, chai) {
        chai.use(sinonChai);
    });

})();
