define(['./cache'], function (cache) {
    'use strict';

    function Hamore(phraseBook, lesson) {
        this.lesson = lesson;
        this.phraseBook = phraseBook;
        this.word = null;
    }

    function greet(hamore) {
        return hamore.phraseBook.greet();
    }

    function askForWord(hamore) {
        hamore.word = hamore.lesson.getNextWord();
        hamore.word.markAsUsed();
        return hamore.phraseBook.askFor(hamore.word);
    }

    function checkWord(hamore, word) {
        var expected = hamore.word.hebrew,
              actual = word.trim();

        return expected === actual;
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
            return [correctWord(this)];
        }
    };

    return Hamore;
});
