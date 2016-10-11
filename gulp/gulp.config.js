'use strict';

var conf = {};

conf.paths = {
    src: './src/',
    dest: './www/',
    indexTemplate: './src/index-templ.html'
};

conf.paths.scripts = [
    './src/app/**/*.js',
    './src/conf/*.js',
    '!./src/app/app.js', /* exclude the root module ('app' module) files */
    '!./src/app/application.ctrl.js', /* exclude the root module ('app' module) files */
    '!./src/app/application.service.js'    /* exclude the root module ('app' module) files */
];

// sass
conf.scss = {
    src: ['./scss/ionic.app.scss'],
    dest: conf.paths.src + 'css/',
    file: 'ionic.app'
};

// app config
conf.config = {
    base:'./config/config.base.json',
    devSrc: './config/config.dev.json',
    prodSrc: './config/config.prod.json',
    dest: './src/conf/'
};

module.exports = conf;

