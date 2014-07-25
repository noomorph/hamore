(function (exports) {

    function formatString() {
        var message = arguments[0],
            i; 

        for (i = 1; i < arguments.length; i++) {
            message = message.replace("#" + i, arguments[i]);
        }

        return message;
    }

    function raiseError() {
        var message = formatString.apply(this, arguments);
        throw new Error(message);
    }

    function apply() {
        var target = arguments[0],
            source,
            i,
            key;

        if (!target) {
            return target;
        }

        for (i = 1; i < arguments.length; i++) {
            source = arguments[i];

            if (source) {
                for (key in source) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    }

    debugger;

    exports.util = {
        apply: apply,
        formatString: formatString,
        raiseError: raiseError
    };

})(typeof exports === 'undefined' ? this.app = this.app || {} : exports);
