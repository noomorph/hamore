define(['./cache'], function (cache) {
    'use strict';

    var frequencies = cache.get('frequencies');

    function empty() { }

    function Word(wordDto) {
        if (wordDto) {
            this.hebrew = wordDto.hebrew;
            this.russian = wordDto.russian;
            this.translit = wordDto.translit;
            this.timesUsed = frequencies[this.hebrew] || 0;
        } else {
            this.hebrew = '';
            this.russian = '';
            this.translit = '';
            this.timesUsed = 0;
        }

        this.onTimesUsedChanged = empty;
    }

    Word.prototype.markAsUsed = function () {
        this.timesUsed += 1;
        frequencies[this.hebrew] = this.timesUsed;

        this.onTimesUsedChanged();
    };

    return Word;
});
