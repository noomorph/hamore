define(['chat', 'chatHistory', 'view', 'hamore'], function (Chat, ChatHistory, View, Hamore) {

    'use strict';

    function App() {
    }

    App.prototype.start = function () {
        var chat = new Chat(),
            chatHistory = ChatHistory.loadSync();

        this.view = new View(document, chat);
        this.teacher = new Hamore(chat);

        chat.loadHistory(chatHistory);
    };

    return App;
});
