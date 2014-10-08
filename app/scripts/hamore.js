define(['./common/utils', './cache'], function (util, cache) {
    'use strict';

    function Hamore(phraseBook, lesson) {
        this.lesson = lesson;
        this.phraseBook = phraseBook;
        this.word = null;
        this.gaveHint = false;
    }

    function greet(hamore) {
        return hamore.phraseBook.greet();
    }

    function askForWord(hamore) {
        hamore.word = hamore.lesson.getNextWord();
        hamore.word.markAsUsed();
        hamore.gaveHint = false;
        return hamore.phraseBook.askFor(hamore.word);
    }

    function checkWord(hamore, word) {
        var expected = hamore.word.hebrew,
              actual = word.trim();

        return expected === actual;
    }

    function giveHint(hamore) {
        return hamore.phraseBook.giveHint(hamore.word);
    }

    function correctWord(hamore) {
        return hamore.phraseBook.correctMistake(hamore.word);
    }

    function appraise(hamore) {
        cache.save('frequencies');
        return hamore.phraseBook.appraise();
    }

    Hamore.prototype.answer = function (message) {
        if (!message || !this.word) {
            return [greet(this), askForWord(this)];
        }

        if (checkWord(this, message.text)) {
            return [appraise(this), askForWord(this)];
        } else {
            if (!this.gaveHint) {
                this.gaveHint = true;
                return [giveHint(this)];
            } else {
                return [correctWord(this)];
            }
        }
    };

    return Hamore;
});
