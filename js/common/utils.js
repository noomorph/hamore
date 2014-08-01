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

    function ajax(options) {
        function onload(e) {
            var eventObject = {
                sender: this,
                originalEvent: e
            };

            if (options.dataType === 'json') {
                eventObject.data = JSON.parse(this.responseText);
            } else {
                eventObject.data = this.responseText;
            }

            if (options.onload) {
                options.onload.call(this, eventObject);
            }
        }

        function onerror() {
            if (options.onerror) {
                options.onerror.apply(this, arguments);
            }
        }

        var request = new XMLHttpRequest();
        request.onload = onload;
        request.onerror = onerror;
        request.open(options.method, options.url, true);
        request.send();
    }

    exports.util = {
        apply: apply,
        formatString: formatString,
        raiseError: raiseError,
        ajax: ajax
    };

})(typeof exports === 'undefined' ? this.app = this.app || {} : exports);
