define(function () {
    'use strict';

    function empty() { }

    function Word(wordDto) {
        if (wordDto) {
            this.hebrew = wordDto.hebrew;
            this.russian = wordDto.russian;
            this.translit = wordDto.translit;
            this.timesUsed = wordDto.timesUsed;
        } else {
            this.hebrew = '';
            this.russian = '';
            this.translit = '';
            this.timesUsed = 0;
        }

        this.onTimesUsedChanged = empty;
    }

    Word.prototype.markAsUsed = function () {
        this.timesUsed++;
        this.onTimesUsedChanged();
    };

    return Word;
});
