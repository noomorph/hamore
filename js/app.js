(function () {
    var chat = new app.Chat(),
        chatHistory = new app.ChatHistory(),
        view = new app.View(document),
        teacher,
        you;

    view.subscribeToChat(chat);

    chat.on('newMessage', function (e) {
        chatHistory.appendMessage(e.message);
        console.log("Message sent to history: ", e.message);
    });

    chat.on('load', function (e) {
        var lastMessage = e.messages[e.messages.length - 1];

        if (!lastMessage || lastMessage.from !== teacher.login) {
            teacher.sendMessage("Шалом!");
        }
    });

    chat.on('newMessage', function (e) {
        if (!e.from || e.from === teacher.login) {
            return;
        }

        teacher.startTyping();

        setTimeout(function () {
            teacher.sendMessage(e.message);
        }, 1000);
    });

    teacher = chat.register("more");
    you = chat.register("you");
    chat.loadHistory(chatHistory);

    document.querySelector("input").addEventListener('keyup', function (e) {
        if (e.keyCode === 13) {
            you.sendMessage({ text: e.target.value });
            e.target.value = "";
            e.preventDefault();
        }
    });
}());

