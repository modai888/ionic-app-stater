'use strict';

var sass = require('gulp-sass');
var sourcemap = require('gulp-sourcemaps');
var del = require('del');
var rename = require('gulp-rename');
var gif = require('gulp-if');
var argv = require('yargs').argv;

module.exports = function (gulp, conf) {

    function dosass(dev, done) {
        // 开发环境或者生产环境指定输出sourcemap时才进行sourcemap输出
        var map = dev !== false || (dev === false && argv.map);

        gulp.src(conf.scss.src)
            .pipe(gif(map, sourcemap.init()))
            .pipe(sass({
                includePaths: ['src/lib/ionic/scss/'],
                outputStyle: 'expanded'
            }))
            // this keeps the gulp build from crashing when there are errors in your SASS file
            .on("error", function (err) {
                sass.logError(err);
                //console.log(err.toString());
                this.emit("end");
            })
            .pipe(gif(map, sourcemap.write('../maps')))
            .pipe(rename(function (path) {
                if (path.extname !== '.map') {
                    path.basename = 'ionic.app';
                    path.extname = '.css'
                }
                return path;
            }))
            .pipe(gulp.dest(conf.scss.dest))
            .on('end', done);
    }

    return {
        dev: function (done) {
            return dosass(true, done);
        },
        prod: function (done) {
            return dosass(false, done);
        }
    }
};
