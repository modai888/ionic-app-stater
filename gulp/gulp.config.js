'use strict';

var conf = {};

conf.paths = {
    src: './src/',
    dest: './www/',
    indexTemplate: './src/index-templ.html'
};

// app
conf.app = {
    scripts: [
        './src/app/**/*.module.js',
        './src/app/**/*.js',
        '!./src/app/app.js',
        '!./src/app/**/*.spec.js',
        '!./src/app/**/*.mock.js'
    ]
};

// lib
conf.lib = {
    scripts: [
        // firebase
        './src/lib/firebase/firebase/firebase.js',
        './src/lib/firebase/angularfire/angularfire.js',
        './src/lib/angular-resource/angular-resource.min.js',
        // form validation
        './src/lib/form-validation/angular-messages/angular-messages.min.js',
        './src/lib/form-validation/fus-messages/fus-messages.js',
        // angular-resource
        './src/lib/angular-resource/angular-resource.min.js',
        // i18n
        './src/lib/i18n/angular-translate/angular-translate.min.js',
        './src/lib/i18n/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
        //
        './src/lib/jsSHA/src/sha1.js',
        //
        './src/lib/ionic-content-banner/ionic.content.banner.min.js',
        // image crop
        './src/lib/ng-img-crop-customized/ng-img-crop.min.js',
        // ng-cordova
        './src/lib/ngCordova/dist/ng-cordova.min.js'
    ]
};

// watch
conf.watch = {
    src: [
        'src/app/**/*.js',
        '!src/app/**/*.spec.js',
        '!src/app/**/*.mock.js'
    ]
};

// sass
conf.scss = {
    src: ['./scss/ionic.app.scss'],
    dest: conf.paths.src + 'css/',
    file: 'ionic.app'
};

// app config
conf.config = {
    base: './src/app/config/config.base.json',
    devSrc: './src/app/config/config.dev.json',
    prodSrc: './src/app/config/config.prod.json',
    dest: './src/app/config/'
};

module.exports = conf;

