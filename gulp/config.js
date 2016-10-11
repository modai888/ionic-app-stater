'use strict';

var argv = require('yargs').argv;
var extend = require('gulp-extend');
var ngConstant = require('gulp-ng-constant');
var rename = require('gulp-rename');

module.exports = function (gulp, conf) {
    var configService = function (src, dest) {
        return gulp.src([conf.config.base, src])
            .pipe(extend('config.json', true))
            .pipe(ngConstant({
                deps: false,
                wrap: true,
                indent:'    '
            }))
            .pipe(rename(function (path) {
                path.basename = 'app.config';
                path.extname = '.js';
            }))
            .pipe(gulp.dest(dest));
    };

    return {
        "config-dev": function () {
            return configService(conf.config.devSrc, conf.config.dest);
        },
        "config-prod": function () {
            return configService(conf.config.prodSrc, conf.config.dest);
        }
    };

};
