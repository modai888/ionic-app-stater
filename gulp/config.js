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
                wrap: true, //包装方式，有es6／common／amd／IIFE，设置为true时，使用IIFE
                indent:'    '
            }))
            .pipe(rename(function (path) {
                path.basename = 'app.config';
                path.extname = '.js';
            }))
            .pipe(gulp.dest(dest));
    };

    return {
        "dev": function () {
            return configService(conf.config.devSrc, conf.config.dest);
        },
        "prod": function () {
            return configService(conf.config.prodSrc, conf.config.dest);
        }
    };

};
