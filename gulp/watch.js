'use strict';

var isOnlyChange = function (event) {
    return event.type === 'changed';
};

module.exports = function (gulp, conf) {
    return function (done) {
        // watch sass
        gulp.watch('./scss/**/*.scss', ['sass']);
        // watch config
        gulp.watch('./src/app/config/*.json', ['config.dev.js']);
        // watch index-templ
        gulp.watch('./src/index-templ.html', ['inject-index']);

        // // 监控脚本文件添加和删除操作
        // gulp.watch(conf.watch.src, function (event) {
        //     console.log(event.type + ' : ' + event.path);
        //     if (!isOnlyChange(event)) {
        //         gulp.start('inject-index');
        //     }
        // });

        done();
    }
};
