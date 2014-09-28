define(['common/utils', 'cache', 'lesson'], function (util, cache, Lesson) {
    'use strict';

    var LESSONS = 'lessons';

    function empty() {}

    function cacheLesson(lesson) {
        var id = lesson && lesson.url,
            lessonsRegistry;

        if (!id) {
            throw new Error('lesson without URL cannot be saved');
        }

        lessonsRegistry = cache.get(LESSONS);
        lessonsRegistry[id] = lesson;

        cache.save(LESSONS);
    }

    function loadLessonFromCache(url) {
        var lessonsRegistry = cache.get(LESSONS),
            lessonDto = lessonsRegistry[url];

        if (lessonDto) {
            return new Lesson(lessonDto);
        }
    }

    function loadLessonFromUrl(url, options) {
        util.ajax({
            url: url,
            dataType: 'json',
            method: 'get',
            onload: function (e) {
                var lesson = new Lesson(e.data);
                lesson.url = url;

                cacheLesson(lesson);
                options.onload(lesson);
            },
            onerror: options.onerror
        });
    }

    function loadLesson(url, options) {
        options = options || {};
        options.onload = options.onload || empty;
        options.onerror = options.onerror || empty;

        var cached = loadLessonFromCache(url);

        if (cached) {
            options.onload(cached);
            return;
        }

        loadLessonFromUrl(url, options);
    }

    function loadLessonsRegistry(options) {
        options = options || {};
        options.onload = options.onload || empty;

        util.ajax({
            url: '/data/index.json',
            dataType: 'json',
            method: 'get',
            onload: function (e) {
                var registry = e.data,
                    cachedRegistry = cache.get(LESSONS),
                    key;

                for (key in registry) {
                    cachedRegistry[key] = cachedRegistry[key] || registry[key];
                }

                cache.save(LESSONS);
                options.onload(util.clone(cachedRegistry));
            },
            onerror: options.onerror || empty
        });
    }

    return {
        registry: loadLessonsRegistry,
        lesson: loadLesson
    };
});
