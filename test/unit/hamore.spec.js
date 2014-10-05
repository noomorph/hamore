/* jshint expr: true */
define(['chai', 'app/hamore'], function (chai, Hamore) {
    'use strict';

    var expect = chai.expect;

    describe('ha-More:', function () {
        var phraseBook, lesson, hamore;

        beforeEach(function () {
            lesson = {
                getNextWord: function () {
                    return { hebrew: 'word' };
                }
            };

            phraseBook = {
                greet: function () {
                    return 'greeting';
                },
                askFor: function (word) {
                    return ['askFor', word];
                },
                correctMistake: function (word) {
                    return ['correctMistake', word];
                },
                appraise: function () {
                    return 'appraise';
                },
                excuse: function () {
                    return 'excuse';
                }
            };

            hamore = new Hamore(phraseBook, lesson);
        });

        it('can be instantated', function () {
            expect(hamore).to.be.ok;
        });

        it('greets at start', function () {
            expect(hamore.answer()[0]).to.eq('greeting');
        });

        it('greets at start even if there is a message to respond', function () {
            expect(hamore.answer({ text: 'whatever' })[0]).to.contain('greeting');
        });

        it('asks for word at start', function () {
            expect(hamore.answer()[1]).to.eql(['askFor', { hebrew: 'word' }]);
        });

        it('appraises if words match', function () {
            hamore.answer();
            expect(hamore.answer({ text: 'word' })).to.contain('appraise');
        });

        it('asks for next word if words match', function () {
            hamore.answer();
            expect(hamore.answer({ text: 'word' })[1]).to.eql(['askFor', { hebrew: 'word' }]);
        });

        it('corrects if words do not match', function () {
            hamore.answer();
            expect(hamore.answer({ text: 'w3rD' })[0]).to.eql(['correctMistake', { hebrew: 'word' }]);
        });
    });
});
