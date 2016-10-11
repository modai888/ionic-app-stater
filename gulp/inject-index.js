'use strict';

var inject = require('gulp-inject');
var rename = require('gulp-rename');

module.exports = function (gulp, conf) {

    return function () {
        gulp.src(conf.paths.indexTemplate)
            .pipe(inject(gulp.src(conf.paths.scripts, {read: false}), {relative: true}))
            .pipe(rename(function (path) {
                path.basename = 'index';
                path.extname = '.html';
            }))
            .pipe(gulp.dest(conf.paths.src));
    }
};
