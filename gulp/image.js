'use strict';

var imagemin = require('gulp-imagemin');

module.exports = function (gulp, conf) {

    return function () {
        return gulp.src('./src/img/**/*')
            .pipe(imagemin())
            .pipe(gulp.dest('./www/img'))
    }
};
