define(function () {
    'use strict';

    var inMemoryInstances = {};

    return {
        get: function (key) {
            var s;

            if (!inMemoryInstances.hasOwnProperty(key)) {
                s = localStorage.getItem(key);

                if (s) {
                    inMemoryInstances[key] = JSON.parse(s);
                } else {
                    inMemoryInstances[key] = {};
                }
            }

            return inMemoryInstances[key];
        },
        save: function (key, value) {
            value = value || inMemoryInstances[key];
            localStorage.setItem(key, JSON.stringify(value));
        }
    };
});
