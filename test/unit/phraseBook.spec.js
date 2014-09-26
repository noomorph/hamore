define(['chai', 'app/phraseBook'], function (chai, PhraseBook) {
    'use strict';

    var expect = chai.expect;

    describe('PhraseBook', function () {
        function createStubDictionary(overrides) {
            var dictionary = {
                'greetings': ['greeting'],
                'questions': ['question'],
                'corrections': ['correction'],
                'appraisals': ['appraisal'],
                'excusations': ['excusation']
            };

            if (overrides) {
                for (var key in overrides) {
                    dictionary[key] = overrides[key];
                }
            }
            return dictionary;
        }

        it('requires dictionary to be created', function () {
            expect(function () { new PhraseBook(); }).to.throw('no dictionary passed');
        });

        it('saves dictionary if it is valid', function () {
            var dictionary = createStubDictionary(),
                book = new PhraseBook(dictionary);

            expect(book.dictionary).to.eq(dictionary);
        });

        describe('phrase sources', function () {
            function itUsesPhraseFromApproriateList(phraseType, bookMethod) {
                var phraseList = phraseType + 's';

                it('uses ' + phraseType + ' from ' + phraseList + ' phrase list', function () {
                    var dictionary = createStubDictionary(),
                        expectedPhrase = dictionary[phraseList][0],
                        book = new PhraseBook(dictionary);

                    expect(bookMethod(book)).to.eq(expectedPhrase);
                });
            }

            itUsesPhraseFromApproriateList('greeting', function (book) {
                return book.greet();
            });

            itUsesPhraseFromApproriateList('question', function (book) {
                return book.askFor();
            });

            itUsesPhraseFromApproriateList('correction', function (book) {
                return book.correctMistake();
            });

            itUsesPhraseFromApproriateList('appraisal', function (book) {
                return book.appraise();
            });

            itUsesPhraseFromApproriateList('excusation', function (book) {
                return book.excuse();
            });
        });

        describe('required fields in dictionary', function () {
            function itRequires(fieldName) {
                it(fieldName + ' is required', function () {
                    var errorMsg = 'no ' + fieldName + ' found in dictionary',
                        dictionary = createStubDictionary();

                    delete dictionary[fieldName];
                    expect(function () { new PhraseBook(dictionary); }).to.throw(errorMsg);

                    dictionary[fieldName] = ['', '', ''];
                    expect(function () { new PhraseBook(dictionary); }).to.throw(errorMsg);
                });
            }

            itRequires('greetings');
            itRequires('questions');
            itRequires('appraisals');
            itRequires('corrections');
            itRequires('excusations');
        });

        describe('asking for word', function () {
            it('should format template phrase with #{ru}', function () {
                var book = new PhraseBook(createStubDictionary({
                    questions: ['#{ru}']
                }));

                expect(book.askFor({ russian: 'слово' })).to.eq('слово');
            });

            it('should format template phrase with #{he}', function () {
                var book = new PhraseBook(createStubDictionary({
                    questions: ['#{he}']
                }));

                expect(book.askFor({ hebrew: 'иврит' })).to.eq('иврит');
            });

            it('should format template phrase with #{tr}', function () {
                var book = new PhraseBook(createStubDictionary({
                    questions: ['#{tr}']
                }));

                expect(book.askFor({ translit: 'ivrit' })).to.eq('ivrit');
            });

            it('should not format template phrase with unknown tag', function () {
                var book = new PhraseBook(createStubDictionary({
                    questions: ['#{xy}']
                }));

                expect(book.askFor({ xy: 'no way!' })).to.eq('#{xy}');
            });

            it('is able to do multiple replacements', function () {
                var book = new PhraseBook(createStubDictionary({
                    questions: ['#{he}#{tr} #{tr}#{he}']
                }));

                expect(book.askFor({
                    hebrew: '1',
                    translit: '2'
                })).to.eq('12 21');
            });
        });
    });
});
