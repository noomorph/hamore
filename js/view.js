(function (exports) {

    function View(container) {

        function $(selector) {
            var found = container.querySelectorAll(selector);

            if (found.length > 1) {
                return found;
            }

            return found[0] || null;
        }

        var self = this;

        function show(el) {
            el.style.display = null;
        }

        function hide(el) {
            el.style.display = 'none';
        }

        function getTyping(login) {
            return $('.chat-typing[data-sender="' + login + '"]');
        }

        function getMessages() {
            return $(".chat-box-messages");
        }

        this.startTyping = function (login) {
            var typing = getTyping(login);
            show(typing);
        };

        this.stopTyping = function (login) {
            var typing = getTyping(login);
            hide(typing);
        };

        this.loadMessages = function (messages) {
            var htmlMessages = getMessages();

            hide(htmlMessages);

            htmlMessages.innerHTML = Handlebars.templates.chatBubbles({
                messages: messages
            });

            show(htmlMessages);
        };

        this.appendMessage = function (message) {
            var htmlMessages = getMessages();

            htmlMessages.innerHTML += Handlebars.templates.chatBubbles({
                messages: [message]
            });
        };
    }

    View.prototype.subscribeToChat = function (chat) {
        var view = this;

        chat.on('startTyping', function (e) {
            view.startTyping(e.from);
        });

        chat.on('stopTyping', function (e) {
            view.stopTyping(e.from);
        });

        chat.on('load', function (e) {
            view.loadMessages(e.messages);
        });

        chat.on('newMessage', function (e) {
            view.stopTyping(e.message.from);
            view.appendMessage(e.message);
        });
    };

    exports.View = View;
})(typeof exports === 'undefined' ? this.app = this.app || {} : exports);
