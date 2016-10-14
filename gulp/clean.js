'use strict';

var del = require('del');

module.exports = function (gulp, conf) {

    return function () {
        return del([conf.paths.dest + '**/*']);
    }
};
