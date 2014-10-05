/* jshint strict: false */
define(function () {
    'use strict';

    function Publisher() {
    }

    Publisher.prototype.registerEvent = function (eventName) {
        this._subscribers = this._subscribers || {};
        this._subscribers[eventName] = [];

        return this;
    };

    Publisher.prototype.registerEvents = function (eventList) {
        eventList.forEach(this.registerEvent, this);
    };

    Publisher.prototype.on = function (eventName, callback) {
        this._subscribers[eventName].push(callback);

        return this;
    };

    Publisher.prototype.off = function (eventName, callback) {
        var index = this._subscribers[eventName].indexOf(callback);
        if (index >= 0) {
            this._subscribers.splice(index, 1);
        }

        return this;
    };

    Publisher.prototype.trigger = function (eventName, eventObject) {
        this._subscribers[eventName].forEach(function (callback) {
            var clone = JSON.parse(JSON.stringify(eventObject));
            callback.call(this, clone);
        }, this);

        return this;
    };

    return Publisher;
});

