define(function () {
    'use strict';

    function Hamore(chat) {
        var self = this;

        chat.on('load', function () {
            self.onLoad.apply(self, arguments);
        });

        chat.on('newMessage', function () {
            self.onNewMessage.apply(self, arguments);
        });

        this.chat = chat.register('more');
    }

    Hamore.prototype.onLoad = function (e) {
        if (e.messages.length === 0) {
            this.type('Шалом!');
            return;
        }

        var lastMessage = e.messages[e.messages.length - 1];

        if (lastMessage.from === 'you') {
            this.answer(lastMessage);
        }
    };

    Hamore.prototype.calculateTimeToType = function (text) {
        var charsInMinute = 1200,
            msInMinute = 60000,
            timeToType = msInMinute * (text.length / charsInMinute);

        return 500 + Math.min(1000, timeToType);
    };

    Hamore.prototype.type = function (text) {
        var chat = this.chat,
            timeToType = this.calculateTimeToType(text);

        setTimeout(function () {
            chat.sendMessage(text);
        }, timeToType);
    };

    Hamore.prototype.answer = function (message) {
        var text = message.text;
        this.type(text + '?');
    };

    Hamore.prototype.onNewMessage = function (e) {
        if (e.message.from === 'you') {
            this.answer(e.message);
        }
    };

    return Hamore;
});
