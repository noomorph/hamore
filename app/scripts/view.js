define(['templates', 'iscroll'], function (templates, IScroll) {
    'use strict';

    function View(container, chat, lessons, onLessonIndexChanged) {
        function $(selector) {
            if (typeof selector === 'string') {
                return container.querySelector(selector);
            }

            return selector;
        }

        this.container = container;

        this.els = {
            header: $('.static-controls'),
            chatBox: new IScroll('.chat-box'),
            chapterSelect: $('select'),
            messages: $('.chat-box-messages'),
            typing: function (login) {
                return $('.chat-typing[data-sender="' + login + '"]');
            },
            avatar: $('.hamore-avatar'),
            logo: $('#hamore-logo'),
            input: $('#message-input')
        };

        var lessonIndex = +localStorage.lessonIndex || 0;
        lessonIndex = Math.min(lessons.length - 1, lessonIndex);

        this.fillChapterSelection(lessons, lessonIndex);
        this.attachListeners(chat);

        this.onLessonIndexChanged = onLessonIndexChanged;
        this.onLessonIndexChanged(lessonIndex);
    }

    function show(el) {
        if (el.style.display === 'none') {
            el.style.removeProperty('display');
        } else {
            el.style.setProperty('display', 'initial');
        }
    }

    function hide(el) {
        if (el.style.display === 'initial') {
            el.style.removeProperty('display');
        } else {
            el.style.setProperty('display', 'none');
        }
    }

    View.prototype.fillChapterSelection = function (lessons, index) {
        var select = this.els.chapterSelect;

        hide(select);
        select.innerHTML = '';

        lessons.forEach(function (lesson, index) {
            var option = document.createElement('option');
            option.value = index;
            option.text = lesson.name;

            select.appendChild(option);
            return option;
        });

        select.selectedIndex = index;
        show(select);
    };

    View.prototype.checkDirection = function (message) {
        message.rtl = message.from !== 'more';
        return message.rtl ? 'rtl' : 'ltr';
    };

    View.prototype.loadMessages = function (messages) {
        var emsgs = this.els.messages;

        messages.forEach(this.checkDirection);

        hide(emsgs);

        while (emsgs.hasChildNodes()) {
            emsgs.removeChild(emsgs.lastChild);
        }

        emsgs.appendChild(templates.chatBubbles({
            messages: messages
        }));

        show(emsgs);

        this.scrollToBottom();
    };

    View.prototype.appendMessage = function (message) {
        this.checkDirection(message);

        this.els.messages.appendChild(templates.chatBubbles({
            messages: [message]
        }));

        this.scrollToBottom();
    };

    View.prototype.getVirtualKeyboardHeight = function () {
        if (this.isTyping) {
            if (navigator.userAgent.match(/iemobile/i)) {
                return 225;
            }
            if (navigator.userAgent.match(/(iphone|ipod|ipad)/i)) {
                return 216;
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
            this.els.chatBox.refresh();
            chatBox.scrollToElement(lastMessage, 'auto');
        }
    };

    View.prototype.attachListeners = function (chat) {
        var self = this,
            you = chat.register('you');

        this.els.chapterSelect.addEventListener('change', function (e) {
            var index = +e.target.value;
            self.onLessonIndexChanged(index);
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

        this.els.input.addEventListener('focus', function () {
            self.updateVirtualKeyboardHeight(true);
            self.scrollToBottom();
        });

        this.els.input.addEventListener('deactivate', function () {
            self.updateVirtualKeyboardHeight(false);
            self.scrollToBottom();
        });

        this.els.input.addEventListener('blur', function () {
            self.updateVirtualKeyboardHeight(false);
            self.scrollToBottom();
        });

        this.els.input.addEventListener('keydown', function (e) {
            var input = self.els.input;

            if (e.which === 13 && input.value) {
                you.sendMessage(input.value);
                input.value = '';
            }

            if (e.which === 13) {
                e.preventDefault();
            }
        });

        chat.on('load', function (e) {
            self.loadMessages(e.messages);
        });

        chat.on('newMessage', function (e) {
            self.appendMessage(e.message);
        });
    };

    return View;
});
