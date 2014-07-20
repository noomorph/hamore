(function () {
    var chatHistory = new app.ChatHistory();

    chatHistory.appendMessage({
        from: "more",
        text: "Шалом!"
    });

    chatHistory.appendMessage({
        from: "you",
        text: "Shalom!"
    });

    document.querySelector(".chat-box").innerHTML = Handlebars.templates.chatBubbles({
        messages: chatHistory.messages
    });
}());

