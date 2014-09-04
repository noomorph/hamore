require.config({
    paths: {
        'handlebars': '../bower_components/handlebars/handlebars.runtime',
        'iscroll': '../bower_components/iscroll/build/iscroll'
    },
    shim : {
        'handlebars': {
            exports: 'Handlebars'
        },
        'iscroll': {
            exports: 'IScroll'
        }
    }
});

require(['app'], function (App) {
    'use strict';

    var app = new App();
    app.start();
});
