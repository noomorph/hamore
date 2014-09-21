/* jshint expr: true */
define(['chai', 'app/hamore'], function (chai, Hamore) {
    'use strict';

    var expect = chai.expect;

    describe('ha-More:', function () {
        var chat, hamore;

        beforeEach(function () {
            chat = {
                on: function () { },
                off: function () { },
                register: function () {
                    return {
                        startTyping: function () { },
                        stopTyping: function () { },
                        sendMessage: sinon.spy()
                    };
                }
            };

            hamore = new Hamore(chat);
        });

        it('can be instantated', function () {
            expect(hamore).to.be.ok;
        });

        describe('chat output, at start-up', function () {
            beforeEach(function () {
                sinon.spy(hamore, 'type');
            });

            describe('when chat log is empty', function () {
                beforeEach(function () {
                    hamore.onLoad({
                        messages: []
                    });
                });

                it('should say hello after a while', function () {
                    expect(hamore.type).to.have.been.calledWith('Шалом!');
                });
            });

            describe('when chat log ends with teacher\'s message', function () {
                beforeEach(function () {
                    hamore.onLoad({
                        messages: [ { from: 'more' }]
                    });
                });

                it('should be silent, waiting for response', function () {
                    expect(hamore.type).to.not.have.been.called;
                });
            });

            describe('when chat log ends with student\'s answer', function () {
                beforeEach(function () {
                    sinon.spy(hamore, 'answer');
                    hamore.onLoad({
                        messages: [
                            { from: 'more' },
                            { from: 'you' }
                        ]
                    });
                });

                it('should mutually answer something', function () {
                    expect(hamore.answer).to.have.been.called;
                });
            });
        });
    });
});
