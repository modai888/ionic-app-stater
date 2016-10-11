'use strict';

var argv = require('yargs').argv;

module.exports = function (gulp, conf) {
    var configService = function (src, dest) {
        return gulp.src(['src/config/config.base.json', src])
            .pipe(extend('config.json', true))
            .pipe(ngConstant({
                deps: false
            }))
            .pipe(rename(function (path) {
                path.basename = 'config';
                path.extname = '.js';
            }))
            .pipe(gulp.dest(dest));
    };

    return function () {
        var environment = argv.e;
        if(environment === 'dev'){
            return configService('src/js/config/config.dev.json', conf.config.dest);
        }

        if(environment === 'prod'){
            return configService('src/js/config/config.prod.json', conf.config.dest);
        }

    };
};
