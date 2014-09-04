require.config({
    paths: {
        'iscroll': '../bower_components/iscroll/build/iscroll-lite'
    },
    shim : {
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
