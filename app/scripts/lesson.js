define(['common/utils'], function (util) {
    'use strict';

    function Lesson(options) {
        this.name = options.name;
        this.url  = options.url;
        this.dictionary = options.dictionary || [];
    }

    Lesson.prototype.cache = function () {
        var lessons = localStorage.getItem('lessons');

        if (lessons) {
            lessons = JSON.parse(lessons);
        } else {
            lessons = {};
        }

        lessons[this.url] = this;

        localStorage.setItem('lessons', JSON.stringify(lessons));
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

        util.ajax({
            url: this.url,
            dataType: 'json',
            method: 'get',
            onload: function (e) {
                Lesson.call(self, e.data);
                setTimeout(function () {
                    self.cache();
                }, 100);

                options.onload(self);
            }
        });
    };

    Lesson.list = function (options) {
        options = options || {};
        options.onload = options.onload || function () {};
        options.onerror = options.onerror || function () {};

        util.ajax({
            url: '/data/index.json',
            dataType: 'json',
            method: 'get',
            onload: function (e) {
                options.onload(e.data);
            }
        });
    };

    return Lesson;
});
