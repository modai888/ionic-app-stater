'use strict';

var sass = require('gulp-sass');
var sourcemap = require('gulp-sourcemaps');
var del = require('del');
var rename = require('gulp-rename');

module.exports = function (gulp, conf) {

    return function (done) {
        gulp.src(conf.scss.src)
            .pipe(sourcemap.init())
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
            .pipe(sourcemap.write('./maps', {
                sourceMappingURL: function (file) {
                    return 'maps/' + file.relative;
                }
            }))
            .pipe(rename({
                basename: 'ionic.app',
                extname: '.css'
            }))
            .pipe(gulp.dest(conf.scss.dest))
            .on('end', done);
    }
};
