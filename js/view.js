(function (exports) {
    function View(container, chat) {
        function $(selector) {
            if (typeof selector === "string") {
                return container.querySelector(selector);
            }

            return selector;
        }

        var self = this;

        this.container = container;

        this.els = {
            header: $(".static-controls"),
            chatBox: new IScroll(".chat-box"),
            chapterSelect: $("select"),
            messages: $(".chat-box-messages"),
            typing: function (login) {
                return $('.chat-typing[data-sender="' + login + '"]');
            },
            avatar: $(".hamore-avatar"),
            logo: $("#hamore-logo"),
            input: $("#message-input")
        };

        this.attachListeners(chat);
    }

    function show(el) {
        el.style.removeProperty('display');
    }

    function hide(el) {
        el.style.setProperty('display', 'none');
    }

    View.prototype.checkDirection = function (message) {
        var rtl;

        if (!message) {
            return "rtl";
        }

        if (typeof message === "string") {
            rtl = /[\u05D0-\u05F4]/.test(message);
        } else {
            rtl = /[\u05D0-\u05F4]/.test(message.text);
            message.rtl = rtl;
        }

        return rtl ? "rtl" : "ltr";
    };

    View.prototype.loadMessages = function (messages) {
        messages.forEach(this.checkDirection);

        hide(this.els.messages);

        this.els.messages.innerHTML = Handlebars.templates.chatBubbles({
            messages: messages
        });

        show(this.els.messages);

        this.scrollToBottom();
    };

    View.prototype.appendMessage = function (message) {
        this.checkDirection(message);

        this.els.messages.innerHTML += Handlebars.templates.chatBubbles({
            messages: [message]
        });

        this.updateVirtualKeyboardHeight(true);
        this.scrollToBottom();
    };

    View.prototype.startTyping = function (login) {
    };

    View.prototype.stopTyping = function (login) {
    };

    View.prototype.getVirtualKeyboardHeight = function () {
        if (this.isTyping) {
            if (navigator.userAgent.match(/iemobile/i)) {
                return 225;
            }
            if (navigator.userAgent.match(/(iphone|ipod|ipad)/i)) {
                return 261;
            }
        }

        return 0;
    };

    View.prototype.updateVirtualKeyboardHeight = function (isTyping) {
        var height;

        if (isTyping !== undefined) {
            this.isTyping = isTyping;
        }

        height = this.getVirtualKeyboardHeight();
        this.els.chatBox.wrapper.style.setProperty('bottom', height + 'px');
        this.els.chatBox.refresh();
    };

    View.prototype.scrollToBottom = function () {
        var chatBox = this.els.chatBox,
            lastMessage = this.els.messages.lastElementChild;

        if (lastMessage) {
            chatBox.scrollToElement(lastMessage, 'auto');
        }
    };

    View.prototype.fixRTL = function () {
        var input = this.els.input,
        currentDir = this.checkDirection(input.value);

        if (input.dir !== currentDir) {
            input.dir = currentDir;
        }
    };

    View.prototype.attachListeners = function (chat) {
        var self = this,
            you = chat.register("you");

        if (app.debug) {
            window.addEventListener('error', function (e) {
                window.alert(e.message);
            });
        }

        this.els.chapterSelect.addEventListener('change', function (e) {
            chat.clear();
        });

        this.els.avatar.addEventListener('click', function (e) {
            show(self.els.logo);
            e.preventDefault();
        });

        this.els.logo.addEventListener('click', function (e) {
            hide(this);
            e.preventDefault();
        });

        this.els.input.addEventListener('deactivate', function () {
            self.updateVirtualKeyboardHeight(false);
            self.scrollToBottom();
        });

        this.els.input.addEventListener('blur', function () {
            self.updateVirtualKeyboardHeight(false);
            self.scrollToBottom();
        });

        this.els.input.addEventListener('focus', this.fixRTL.bind(this));
        this.els.input.addEventListener('keydown', this.fixRTL.bind(this));

        this.els.input.addEventListener('keydown', function (e) {
            var input = self.els.input;

            if (e.which === 13 && input.value) {
                you.sendMessage(input.value);
                input.value = "";
                e.preventDefault();
                return false;
            }
        });

        chat.on('startTyping', function (e) {
            self.startTyping(e.from);
        });

        chat.on('stopTyping', function (e) {
            self.stopTyping(e.from);
        });

        chat.on('load', function (e) {
            self.loadMessages(e.messages);
        });

        chat.on('newMessage', function (e) {
            self.stopTyping(e.message.from);
            self.appendMessage(e.message);
        });
    };

    exports.View = View;
})(typeof exports === 'undefined' ? this.app = this.app || {} : exports);
