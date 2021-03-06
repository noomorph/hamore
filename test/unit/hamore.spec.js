/* jshint expr: true */
define(['chai', 'app/word', 'app/hamore'], function (chai, Word, Hamore) {
    'use strict';

    var expect = chai.expect;

    describe('ha-More:', function () {
        var phraseBook, lesson, hamore, word;

        beforeEach(function () {
            lesson = {
                getNextWord: function () {
                    word = new Word({ hebrew: 'word' }, function () {});
                    return word;
                }
            };

            phraseBook = {
                greet: function () {
                    return 'greeting';
                },
                askFor: function (word) {
                    return ['askFor', word];
                },
                giveHint: function (word) {
                    return ['giveHint', word];
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
            expect(hamore.answer()[1]).to.eql(['askFor', word]);
        });

        it('appraises if words match', function () {
            hamore.answer();
            expect(hamore.answer({ text: 'word' })).to.contain('appraise');
        });

        it('asks for next word if words match', function () {
            hamore.answer();
            expect(hamore.answer({ text: 'word' })[1]).to.eql(['askFor', word]);
        });

        it('gives hint for 1st time if words do not match', function () {
            hamore.answer();
            expect(hamore.answer({ text: 'w3rD' })[0]).to.eql(['giveHint', word]);
        });

        it('corrects if words do not match for the second time', function () {
            hamore.answer();
            hamore.answer({ text: 'w3rD' });
            expect(hamore.answer({ text: 'w3rD' })[0]).to.eql(['correctMistake', word]);
        });
    });
});
