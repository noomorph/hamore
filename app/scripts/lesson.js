define(['word'], function (Word) {
    'use strict';

    function Lesson(lessonDto, isSelected) {
        var self = this;

        if (lessonDto) {
            this.name = lessonDto.name;
            this.words = lessonDto.words;
        } else {
            this.name = '';
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

    function uniformRandomIndexAmongTheLeastUsedWords(arr) {
        var i = 0;

        while (i < arr.length && arr[i].timesUsed === arr[0].timesUsed) {
            i++;
        }

        return Math.floor(Math.random() * i);
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
        var index = uniformRandomIndexAmongTheLeastUsedWords(this.words),
            nextWord = this.words.splice(index, 1)[0];

        if (nextWord) {
            this.words.push(nextWord);
        }

        return nextWord;
    };

    return Lesson;
});
