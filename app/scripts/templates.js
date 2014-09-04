define(function () {
    'use strict';

    function compileBubble(msg) {
        var li,
            a,
            text;

        if (msg) {
            li = document.createElement('li');
            li.className = 'chat-bubble';
            li.dataset.sender = msg.from;

            a = document.createElement('a');
            a.name = 'msg-' + msg.id;
            if (msg.rtl) {
                a.dir = 'rtl';
            }

            text = document.createTextNode(msg.text);

            a.appendChild(text);
            li.appendChild(a);
        }

        return li;
    }

    function compileChatBubbles(data) {
        var fragment = document.createDocumentFragment();

        if (data) {
            data.messages.forEach(function (msg) {
                fragment.appendChild(compileBubble(msg));
            });
        }

        return fragment;
    }

    return {
        chatBubbles: compileChatBubbles
    };
});

