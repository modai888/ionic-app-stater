'use strict';

module.exports = function (gulp, conf) {
    return function () {
        gulp.watch('./scss/**/*.scss',['sass']);
    }
};
