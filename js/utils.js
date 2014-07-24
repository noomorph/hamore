(function (exports) {

    function formatString() {
        var message = arguments[0],
            i; 

        for (i = 1; i < arguments.length; i++) {
            message = message.replace("#" + i, arguments[i]);
        }

        return message;
    }

    exports.raiseError = function (msg) {
        var message = formatString.apply(this, arguments);
        throw new Error(message);
    };

})(typeof exports === 'undefined' ? this.app = this.app || {} : exports);
