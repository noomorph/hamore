var fs = require('fs'),
    path = require('path'),
    lessonsDir = process.argv[2];

function listAllFiles(dir) {
    var base = path.join(__dirname, dir);

    return fs.readdirSync(base).map(function (filename) {
        return path.join(base, filename);
    }).filter(function (filename) {
        return (/\.json$/i).test(filename) &&
               !(/index\.json$/i).test(filename);
    });
}

function getJSON(file) {
    var contents = fs.readFileSync(file, 'utf-8');

    try {
        return JSON.parse(contents);
    }
    catch (e) {
        return {};
    }
}

function getMetaInfo(file) {
    var json = getJSON(file);

    return {
        name: json.name,
        url: json.url
    };
}

function getAllLessons() {
    var files = listAllFiles(lessonsDir),
        lessons = [];

    files.forEach(function (file) {
        var meta = getMetaInfo(file);

        if (meta.name && meta.url) {
            lessons.push(meta);
        }
    });

    return lessons;
}


var lessons = getAllLessons();
console.log(lessons);
