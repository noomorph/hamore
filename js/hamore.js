(function (exports) {

    function Hamore(chat) {
        var self = this;

        chat.onreceive = function (message) {
            if (self.expectedWord !== message) {

            }
        };
        chat.send();
    }

    Hamore.prototype.compareWords = function (actual, expected) {

    };

    exports.Hamore = Hamore;
})(typeof exports === 'undefined' ? this.app = this.app || {} : exports);
