define(['chat', 'chatHistory', 'lesson', 'phraseBook', 'data', 'view', 'hamore'],
    function (Chat, ChatHistory, Lesson, PhraseBook, data, View, Hamore) {
        'use strict';

        function App() {
        }

        App.prototype.start = function () {
            var chat = new Chat(),
                moreChat = chat.register('more'),
                phraseBook = new PhraseBook(data.phraseBook),
                lessons = data.lessons.map(function (lessonDto) {
                    return new Lesson(lessonDto);
                }),
                hamore;

            new View(document, chat, lessons, function (index) {
                localStorage.lessonIndex = index;
                hamore = new Hamore(phraseBook, lessons[index]);
            });

            chat.on('load', function (e) {
                onNewMessage(this, e.messages);
            }).on('newMessage', function (e) {
                if (e.message.from !== 'more') {
                    onNewMessage(this, [e.message]);
                }
            });

            chat.loadHistory(new ChatHistory());

            function onNewMessage(chat, messages) {
                var m = messages,
                    msg = m[m.length - 1];

                var answerMsgs = hamore.answer(msg);
                answerMsgs.forEach(function (msg, index) {
                    setTimeout(function () {
                        moreChat.sendMessage(msg);
                    }, index * 750);
                });
            }
        };

        return App;
    }
);
