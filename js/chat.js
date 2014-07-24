(function (exports) {

    var ERRORS = {
        NO_MEMBER: "Chat registration failed: no member passed",
        NO_MEMBER_LOGIN: "Chat registration failed: member has no login",
        ALREADY_REGISTERED: "User with \"#1\" is already registered."
    };

    function Chat() {
        this.lastModified = null;
        this.messages = [];
        this.members = {};

        this._maxId = 0;

        this._subscribers = {
            'load': [],
            'newMessage': [],
            'startTyping': [],
            'stopTyping': []
        };
    }

    Chat.prototype.newId = function () {
        return (++this._maxId);
    };

    Chat.prototype.on = function (eventName, callback) {
        this._subscribers[eventName].push(callback);
        return this;
    };

    Chat.prototype.off = function (eventName, callback) {
        var index = this._subscribers[eventName].indexOf(callback);
        if (index >= 0) {
            this._subscribers.splice(index, 1);
        }
        
        return this;
    };

    Chat.prototype.trigger = function (eventName, eventObject) {
        this._subscribers[eventName].forEach(function (callback) {
            var clone = JSON.parse(JSON.stringify(eventObject));
            callback(clone);
        });
    };

    Chat.prototype.loadHistory = function (chatHistory) {
        function calculateMaxId(messages) {
            if (messages.length < 1) {
                return 0;
            }

            var ids = messages.map(function (message) {
                return message.id || 0;
            });

            return Math.max.apply(null, ids);
        }

        this._maxId = calculateMaxId(chatHistory.messages);
        this.messages = chatHistory.messages;

        this.trigger('load', {
            messages: this.messages
        });
    };

    Chat.prototype.startTyping = function (from) {
        this.trigger('startTyping', {
            from: from
        });
    };

    Chat.prototype.stopTyping = function (from) {
        this.trigger('stopTyping', {
            from: from
        });
    };

    Chat.prototype.sendMessage = function (details) {
        details.id = this.newId();
        details.timeStamp = new Date();

        this.stopTyping(details.from);

        this.trigger('newMessage', {
            message: {
                id: details.id,
                timeStamp: details.timeStamp,
                from: details.from,
                text: details.text
            }
        });
    };

    Chat.prototype.register = function (login) {
        if (!login) {
            app.raiseError(ERRORS.NO_MEMBER_LOGIN);
        }

        if (this.members.hasOwnProperty(login)) {
            app.raiseError(ERRORS.ALREADY_REGISTERED, login);
        }

        var chat = this;

        chat.members[login] = true;

        return {
            startTyping: function () {
                chat.startTyping(login);
            },
            stopTyping: function () {
                chat.stopTyping(login);
            },
            sendMessage: function (details) {
                if (typeof details === "string") {
                    details = { text: details };
                }

                details.from = login;
                chat.sendMessage(details);
            }
        };
    };

    Chat.prototype.logOut = function (member) {
        if (member && member.on && member.on.id) {
            return this.unsubscribe(member.on.id);
        }

        return false;
    };

    exports.Chat = Chat;

})(typeof exports === 'undefined' ? this.app = this.app || {} : exports);
