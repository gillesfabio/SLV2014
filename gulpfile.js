'use strict';

var fs        = require('fs');
var path      = require('path');
var concat    = require('gulp-concat');
var express   = require('express');
var gulp      = require('gulp');
var minifyCSS = require('gulp-minify-css');
var swig      = require('swig');
var tempWrite = require('temp-write');
var generator = require('./generator');

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

var BASE_URL       = process.env.BASE_URL ? process.env.BASE_URL : '/';
var SERVER_PORT    = 3000;
var BUILD_DIR      = 'build';
var SCRIPTS_CONCAT = 'scripts.js';
var STYLES_CONCAT  = 'styles.css';
var MODERNIZR      = 'vendor/foundation/js/vendor/modernizr.js';

var SCRIPTS = [
  'vendor/jquery/dist/jquery.min.js',
  'vendor/foundation/js/foundation.min.js',
  'vendor/underscore/underscore.js',
  'vendor/backbone/backbone.js',
  'vendor/handlebars/handlebars.min.js',
  'vendor/jspdf/dist/jspdf.min.js',
  'vendor/markdown/lib/markdown.js',
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

// -----------------------------------------------------------------------------
// Templates
// -----------------------------------------------------------------------------

swig.setDefaults({cache: false});

// Custom Swig instance (to avoid conflicts with Handlebars delimiters).
var customSwig = new swig.Swig({
  varControls: ['<%=', '%>'],
  tagControls: ['<%', '%>'],
  cmtControls: ['<#', '#>']
});

// Template context
var context = {
  env: 'production',
  modernizr: MODERNIZR,
  scripts: SCRIPTS,
  styles: STYLES,
  baseurl: BASE_URL
};

// -----------------------------------------------------------------------------
// Express Server
// -----------------------------------------------------------------------------

var server = express();
server.use(express.compress());
server.use(express.json());
server.use(express.urlencoded());
server.set('view cache', false);

// -----------------------------------------------------------------------------
// Tasks
// -----------------------------------------------------------------------------

var buildTasks = [
  'build-data',
  'build-fonts',
  'build-scripts',
  'build-styles',
  'build-index'
];

gulp.task('build-json', function(cb) {
  generator.buildData(function(err, data) {
    if (err) throw new Error(err);
    var json = JSON.stringify(data, null, 2);
    var src  = fs.createReadStream(tempWrite.sync(json, 'data.json'));
    var dest = fs.createWriteStream(path.join(__dirname, 'data', 'data.json'));
    src.pipe(dest);
    src.on('end', function() {
      return cb();
    });
  });
});

gulp.task('build-data', ['build-json'], function() {
  var file = path.join(__dirname, 'data', 'data.json');
  gulp.src(file).pipe(gulp.dest(BUILD_DIR));
});

gulp.task('build-index', function() {
  var compiled = customSwig.compileFile(path.join(__dirname, 'views', 'index.html'));
  var tpl = compiled(context);
  var file = tempWrite.sync(tpl, 'index.html');
  gulp.src(file).pipe(gulp.dest(BUILD_DIR));
});

gulp.task('build-fonts', function() {
  return gulp.src(FONTS)
    .pipe(gulp.dest(BUILD_DIR + '/fonts'));
});

gulp.task('build-scripts', function() {
  gulp.src(MODERNIZR)
    .pipe(gulp.dest(path.join(BUILD_DIR, 'js')));
  gulp.src(SCRIPTS)
    .pipe(concat(SCRIPTS_CONCAT))
    .pipe(gulp.dest(path.join(BUILD_DIR, 'js')));
});

gulp.task('build-styles', function() {
  return gulp.src(STYLES)
    .pipe(minifyCSS())
    .pipe(concat(STYLES_CONCAT))
    .pipe(gulp.dest(path.join(BUILD_DIR, 'css')));
});

gulp.task('watch', function() {
  var files = ['src/**', 'data/**', 'views/**'];
  gulp.watch(files, buildTasks);
});

gulp.task('server-production', buildTasks, function() {
  server.use(express.static(path.join(__dirname, 'build')));
  server.get('*', function(req, res) { res.sendfile(path.join(BUILD_DIR, 'index.html')); });
  server.listen(SERVER_PORT);
});

gulp.task('server-development', ['build-json'], function() {
  context.env = 'development';
  var json = require('./data/data.json');
  server.engine('html', customSwig.renderFile);
  server.set('view engine', 'html');
  server.set('views', path.join(__dirname, 'views'));
  server.use(express.static(__dirname));
  server.get('/data.json', function(req, res) { res.send(json); });
  server.get('*', function(req, res) { res.render('index', context); });
  server.listen(SERVER_PORT);
});

gulp.task('server-test', ['build-json'], function() {
  context.env = 'development';
  var json = require('./data/data.json');
  server.use(express.static(__dirname));
  server.get('/data.json', function(req, res) { res.send(json); });
  server.get('*', function(req, res) { res.sendfile('test/index.html'); });
  server.listen(SERVER_PORT);
});

gulp.task('build', buildTasks);
gulp.task('runserver-dev', ['server-development']);
gulp.task('runserver-test', ['server-test']);
gulp.task('runserver', ['server-production', 'watch']);
gulp.task('default', ['dev']);
