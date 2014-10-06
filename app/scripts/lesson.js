define(['word'], function (Word) {
    'use strict';

    function Lesson(lessonDto, isSelected) {
        var self = this;

        if (lessonDto) {
            this.name = lessonDto.name;
            this.url = lessonDto.url;
            this.words = lessonDto.words;
        } else {
            this.name = '';
            this.url = '';
            this.words = [];
        }

        this.isSelected = Boolean(isSelected);

        this.boundReorderWords = function () {
            reorderWords(self.words);
        };

        this.words = this.words.map(function (wordDto) {
            var word = new Word(wordDto);
            word.onTimesUsedChanged = this.boundReorderWords;

            return word;
        }, this);

        reorderWords(this.words);
    }

    function randomExpIndex(len) {
        var U = Math.random(),
            E = -Math.log(U) / 20,
            r = Math.min(0.999, E);

        return Math.floor(r * len);
    }

    function reorderWords(words) {
        words.sort(function (a, b) {
            if (a.timesUsed < b.timesUsed) {
                return -1;
            } else if (a.timesUsed > b.timesUsed) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    Lesson.prototype.getNextWord = function () {
        var index = randomExpIndex(this.words.length),
            nextWord = this.words.splice(index, 1)[0];

        if (nextWord) {
            this.words.push(nextWord);
        }

        return nextWord;
    };

    return Lesson;
});
