define(function () {
    'use strict';

    var KEYS = {
        GREETINGS: 'greetings',
        QUESTIONS: 'questions',
        CORRECTIONS: 'corrections',
        APPRAISALS: 'appraisals',
        EXCUSATIONS: 'excusations'
    };

    function PhraseBook(dictionary) {
        var property, key;

        if (!dictionary) {
            throw new Error('no dictionary passed');
        }

        for (property in KEYS) {
            key = KEYS[property];

            if (!pickRandomPhrase(dictionary, key)) {
                throw new Error('no ' + key + ' found in dictionary');
            }
        }

        this.dictionary = dictionary;
    }

    function pickRandomPhrase(dictionary, entryKey) {
        var phraseList = dictionary[entryKey] || [],
            index;

        if (phraseList.length > 0) {
            index = Math.floor(Math.random() * phraseList.length);
            return phraseList[index] || '';
        }

        return '';
    }

    function formatPhrase(templatePhrase, substitutions) {
        var formattedPhrase, key, pattern;

        formattedPhrase = templatePhrase;
        for (key in substitutions) {
            pattern = new RegExp('#{' + key + '}', 'mg');
            formattedPhrase = formattedPhrase.replace(pattern, substitutions[key]);
        }

        return formattedPhrase;
    }

    function formatRandomPhrase(dictionary, key, word) {
        var phrase = pickRandomPhrase(dictionary, key);

        if (word) {
            return formatPhrase(phrase, {
                he: word.hebrew,
                ru: word.russian,
                tr: word.translit
            });
        }

        return phrase;
    }

    PhraseBook.prototype.greet = function () {
        return formatRandomPhrase(this.dictionary, KEYS.GREETINGS);
    };

    PhraseBook.prototype.askFor = function (word) {
        return formatRandomPhrase(this.dictionary, KEYS.QUESTIONS, word);
    };

    PhraseBook.prototype.correctMistake = function (word) {
        return formatRandomPhrase(this.dictionary, KEYS.CORRECTIONS, word);
    };

    PhraseBook.prototype.appraise = function () {
        return formatRandomPhrase(this.dictionary, KEYS.APPRAISALS);
    };

    PhraseBook.prototype.excuse = function () {
        return formatRandomPhrase(this.dictionary, KEYS.EXCUSATIONS);
    };

    return PhraseBook;
});
