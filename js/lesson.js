(function (exports) {
    function Lesson(options) {
        this.name = options.name;
        this.url  = options.url;
        this.dictionary = options.dictionary || [];
    }

    Lesson.prototype.cache = function (options) {
        var lessons = localStorage.getItem("lessons");

        if (lessons) {
            lessons = JSON.parse(lessons);
        } else {
            lessons = {};
        }

        lessons[this.name] = this;

        localStorage.setItem("lessons", JSON.stringify(lessons));
    };

    Lesson.prototype.load = function (options) {
        options = options || {};
        options.onload = options.onload || function () {};
        options.onerror = options.onerror || function () {};

        if (this.dictionary.length > 0) {
            options.onload(this);
            return;
        }

        var self = this;
        app.util.ajax({
            url: this.url,
            dataType: 'json',
            method: 'get',
            onload: function (e) {
                Lesson.call(self, e.data);
                options.onload(self);
            }
        });
    };

    Lesson.list = function () {
        app.util.ajax({
            url: this.url,
            dataType: 'json',
            method: 'get',
            onload: function (e) {
                Lesson.call(self, e.data);
                options.onload(self);
            }
        });
    };

    exports.Lesson = Lesson;
})(typeof exports === 'undefined' ? this.app = this.app || {} : exports);
