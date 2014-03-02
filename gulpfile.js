'use strict';

var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var express = require('express');

var SERVER_PORT = 3000;
var BUILD = 'build';
var SCRIPTS_CONCAT = 'scripts.js';
var STYLES_CONCAT = 'styles.css';
var MODERNIZR = 'vendor/foundation/js/vendor/modernizr.js';
var SCRIPTS = [
  'vendor/jquery/dist/jquery.min.js',
  'vendor/foundation/js/foundation.min.js',
  'vendor/underscore/underscore.js',
  'vendor/backbone/backbone.js',
  'vendor/handlebars/handlebars.min.js',
  'src/app.js'
];
var STYLES = [
  'vendor/foundation/css/normalize.css',
  'vendor/foundation/css/foundation.css',
  'vendor/font-awesome/css/font-awesome.min.css',
  'src/app.css'
];
var FONTS = [
  'vendor/font-awesome/fonts/**'
];
var DATA = [
  'data/data.json'
];

var server = express();
server.use(express.logger());
server.use(express.compress());
server.use(express.json());
server.use(express.urlencoded());
server.use(express.static(path.join(__dirname, 'build')));

gulp.task('clean', function() {
  return gulp.src(BUILD, {read: false})
    .pipe(clean());
});

gulp.task('serve', function() {
  server.listen(SERVER_PORT);
});

gulp.task('data', function() {
  gulp.src(DATA).pipe(gulp.dest(BUILD));
});

gulp.task('fonts', function() {
  gulp.src(FONTS)
    .pipe(gulp.dest(BUILD + '/fonts'));
});

gulp.task('scripts', function() {
  gulp.src(MODERNIZR).pipe(gulp.dest(BUILD));
  gulp.src(SCRIPTS)
    .pipe(concat(SCRIPTS_CONCAT))
    .pipe(gulp.dest(BUILD));
});

gulp.task('styles', function() {
  gulp.src(STYLES)
    .pipe(minifyCSS())
    .pipe(concat(STYLES_CONCAT))
    .pipe(gulp.dest(BUILD));
});

gulp.task('html', function() {
  gulp.src('index.html')
    .pipe(gulp.dest(BUILD));
});

gulp.task('watch', function() {
  gulp.watch('src/**', ['scripts', 'styles']);
  gulp.watch('data/**', ['data']);
  gulp.watch('index.html', ['html']);
});

gulp.task('default', [
  'data',
  'fonts',
  'scripts',
  'styles',
  'html',
  'serve',
  'watch'
]);
