/* jshint expr:true */
define(['app'], function (app) {
    'use strict';

    describe('app', function () {
        it('can be used as dependency', function () {
            expect(app).to.be.ok;
        });
    });
});
