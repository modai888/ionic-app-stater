'use strict';

var sh = require('shelljs');

module.exports = function () {
    return function (done) {
        sh.exec('ionic serve', function (code, stdout, stderr) {
            console.log('Exit code:', code);
            console.log('Program output:', stdout);
            console.log('Program stderr:', stderr);
            done();
        })
    }
};
