(function (exports) {

    function Hamore(chat) {
        var self = this;

        chat.on('load', this.onLoad.bind(this));
        chat.on('newMessage', this.onNewMessage.bind(this));

        this.chat = chat.register("more");
    }

    Hamore.prototype.onLoad = function (e) {
        if (e.messages.length === 0) {
            this.type("Шалом!", 500);
            return;
        }

        var lastMessage = e.messages[e.messages.length - 1];

        if (lastMessage.from === "you") {
            this.answer(lastMessage);
        }
    };

    Hamore.prototype.type = function (text, duration) {
        var chat = this.chat;

        setTimeout(function () {
            chat.startTyping();

            setTimeout(function () {
                chat.sendMessage(text);
            }, duration || 50);
        }, 500);
    };

    Hamore.prototype.answer = function (message) {
        var text = message.text;
        this.type(text + "?", text.length * 50);
    };

    Hamore.prototype.onNewMessage = function (e) {
        if (e.message.from === "you") {
            this.answer(e.message);
        }
    };

    exports.Hamore = Hamore;
})(typeof exports === 'undefined' ? this.app = this.app || {} : exports);
