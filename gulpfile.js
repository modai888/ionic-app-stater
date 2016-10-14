'use strict';
var gulp = require('gulp');
var sequence = require('gulp-sequence');

var config = require('./gulp/gulp.config');

// var CONF = {};
// CONF.DEST = './dist/';
// CONF.JS = {};
// CONF.JS.SRC = ['./src/app/**/*.js'];
// CONF.JS.MIN = 'build.min.js';
// CONF.JS.FAT = 'build.js';
// CONF.ENVIRONMENT = {};
// CONF.ENVIRONMENT.FILE = 'config.js';
// CONF.ENVIRONMENT.DEST = './src/app/config/';
// CONF.ENVIRONMENT.DEV = './conf/config.dev.js';
// CONF.ENVIRONMENT.DEVBUILD = './conf/config.dev.build.js';
// CONF.ENVIRONMENT.PREPROD = './conf/config.preprod.js';
// CONF.ENVIRONMENT.PROD = './conf/config.prod.js';

// DEFAULT TASK
//gulp.task('default', ['serve']);

// GULP WRAPPERS
// options :
// -t target
// -e environment
//gulp.task('serve', sequence('dev', 'proxy', 'js', 'watch', 'ionic-serve'));
//gulp.task('run', sequence('update-conf', 'js', 'ionic-run'));
//gulp.task('build', sequence('update-conf', 'js', 'ionic-build'));
//gulp.task('release', sequence('update-conf', 'js', 'release'));
//
//// IONIC TASKS
//gulp.task('ionic-serve', getTask('ionic-serve'));
//gulp.task('ionic-run', getTask('ionic-run'));
//gulp.task('ionic-build', getTask('ionic-build'));
//
//// UPDATE ENVIRONMENT
//gulp.task('update-conf', getTask('update-conf'));
//gulp.task('proxy', getTask('proxy'));
//gulp.task('dev', getTask('dev'));
//gulp.task('devbuild', getTask('devbuild'));
//gulp.task('preprod', getTask('preprod'));
//gulp.task('prod', getTask('prod'));
//
//// BUILD
//gulp.task('js', getTask('js'));
//gulp.task('watch', getTask('watch'));
//
//// RELEASE
//gulp.task('release', getTask('release'));

// 开发

gulp.task('default', function () {
    console.log('default');
});

gulp.task('serve', getTask('ionic-serve'));

// ionic serve hooks
gulp.task('serve:before', sequence(['config:dev', 'sass'], 'inject-index'));
gulp.task('serve:after', ['watch']);

// sass
gulp.task('sass', getTask('sass'));

// config
var configTasks = getTask('config');
gulp.task('config:dev', configTasks['config-dev']);
gulp.task('config:prod', configTasks['config-prod']);

// injex-index
gulp.task('inject-index', getTask('inject-index'));

// build
gulp.task('build', sequence(['config:dev', 'sass'], 'inject-index', 'clean', function () {
    return gulp.src(['./src/**/*', '!./src/index-templ.html', '!./src/index-template.html'])
        .pipe(gulp.dest(config.paths.dest));
}));

// clean
gulp.task('clean', getTask('clean'));

gulp.task('watch', getTask('watch'));

// USED BY IONIC CLI
gulp.task('install', ['git-check'], getTask('install'));
gulp.task('git-check', getTask('git-check'));

function getTask(task) {
    return require('./gulp/' + task)(gulp, config);
}