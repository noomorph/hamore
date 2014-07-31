app.debug = false;

window.addEventListener('load', function () {
    var chat = new app.Chat(),
        chatHistory = app.ChatHistory.loadSync(),
        view = new app.View(document, chat),
        teacher = new app.Hamore(chat);

    chat.loadHistory(chatHistory);
});
