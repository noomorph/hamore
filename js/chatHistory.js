(function (exports) {

    var HISTORY_ID = "chatHistory",
        AUTOSAVE   = true;

    function ChatHistory(memento) {
        if (memento) {
            this.lastModified = memento.lastModified;
            this.messages = memento.messages;
        } else {
            this.lastModified = new Date();
            this.messages = [];
        }
    }

    /* private methods */
    function calculateMaxId(messages) {
        var ids = messages.map(function (message) {
            return message.id || 0;
        });

        return Math.max.apply(null, ids);
    }

    /* class methods */
    ChatHistory.loadSync = function () {
        var memento = localStorage.getItem(HISTORY_ID);

        if (memento) {
            return new ChatHistory(JSON.parse(memento));
        }

        return new ChatHistory();
    };

    /* instance methods */
    ChatHistory.prototype.clear = function () {
        ChatHistory.call(this);
        localStorage.removeItem(HISTORY_ID);
    };


    ChatHistory.prototype.getMemento = function () {
        return {
            lastModified: this.lastModified,
            messages: this.messages
        };
    };

    ChatHistory.prototype.appendMessage = function (message) {
        if (!message) return;
        if (!message.id) return;
        if (!message.timeStamp) return;

        if (message.timeStamp < this.lastModified) return;

        this.messages.push(message);
        this.lastModified = message.timeStamp;

        if (AUTOSAVE) {
            this.saveSync();
        }
    };

    ChatHistory.prototype.saveSync = function () {
        var raw = JSON.stringify(this.getMemento());
        localStorage.setItem(HISTORY_ID, raw);
    };

    exports.ChatHistory = ChatHistory;
})(typeof exports === 'undefined' ? this.app = this.app || {} : exports);
