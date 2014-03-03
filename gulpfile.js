'use strict';

var fs        = require('fs');
var path      = require('path');
var clean     = require('gulp-clean');
var concat    = require('gulp-concat');
var express   = require('express');
var gulp      = require('gulp');
var minifyCSS = require('gulp-minify-css');
var swig      = require('swig');
var YAML      = require('yamljs');
var utils     = require('./utils');

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

var SERVER_PORT    = 3000;
var BUILD          = 'build';
var SCRIPTS_CONCAT = 'scripts.js';
var STYLES_CONCAT  = 'styles.css';
var MODERNIZR      = 'vendor/foundation/js/vendor/modernizr.js';

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

// -----------------------------------------------------------------------------
// Templates
// -----------------------------------------------------------------------------

// Custom Swig instance (to avoid conflicts with Handlebars delimiters).
var customSwig = new swig.Swig({
  varControls: ['<%=', '%>'],
  tagControls: ['<%', '%>'],
  cmtControls: ['<#', '#>']
});

// Template context
var context = {
  env: 'development',
  modernizr: MODERNIZR,
  scripts: SCRIPTS,
  styles: STYLES
};

// -----------------------------------------------------------------------------
// Express Server
// -----------------------------------------------------------------------------

var server = express();
server.use(express.compress());
server.use(express.json());
server.use(express.urlencoded());

// -----------------------------------------------------------------------------
// Tasks
// -----------------------------------------------------------------------------

gulp.task('clean', function() {
  return gulp.src(BUILD, {read: false}).pipe(clean());
});

gulp.task('create-json', function() {
  var output = path.join(__dirname, 'data', 'data.json');
  var obj = YAML.load(path.join(__dirname, 'data', 'data.yaml'));
  utils.createJSON(obj, output);
});

gulp.task('build-data', ['create-json'], function() {
  var file = path.join(__dirname, 'data', 'data.json');
  return gulp.src(file).pipe(gulp.dest(BUILD));
});

gulp.task('build-fonts', function() {
  return gulp.src(FONTS).pipe(gulp.dest(BUILD + '/fonts'));
});

gulp.task('build-scripts', function() {
  gulp.src(MODERNIZR).pipe(gulp.dest(BUILD));
  gulp.src(SCRIPTS)
    .pipe(concat(SCRIPTS_CONCAT))
    .pipe(gulp.dest(BUILD));
});

gulp.task('build-styles', function() {
  return gulp.src(STYLES)
    .pipe(minifyCSS())
    .pipe(concat(STYLES_CONCAT))
    .pipe(gulp.dest(BUILD));
});

gulp.task('watch', function() {
  var files = ['src/**', 'data/**', 'views/**'];
  var tasks = ['build-data', 'build-fonts', 'build-scripts', 'build-styles'];
  gulp.watch(files, tasks);
});

gulp.task('production-server', ['build-data', 'build-fonts', 'build-scripts', 'build-styles'], function() {
  context.env = 'production';
  var output = path.join(BUILD, 'index.html');
  var compiled = customSwig.compileFile(path.join(__dirname, 'views', 'index.html'));
  var tpl = compiled(context);
  var file = fs.openSync(output, 'w+');
  fs.writeSync(file, tpl);
  fs.closeSync(file);
  server.use(express.static(path.join(__dirname, 'build')));
  server.get('*', function(req, res) { res.sendfile(path.join(BUILD, 'index.html')); });
  server.listen(SERVER_PORT);
});

gulp.task('development-server', ['create-json'], function() {
  var json = require('./data/data.json');
  server.engine('html', customSwig.renderFile);
  server.set('view engine', 'html');
  server.set('views', path.join(__dirname, 'views'));
  server.use(express.static(__dirname));
  server.get('/data.json', function(req, res) { res.send(json); });
  server.get('*', function(req, res) { res.render('index', context); });
  server.listen(SERVER_PORT);
});

gulp.task('dev', ['development-server']);
gulp.task('prod', ['production-server', 'watch']);
gulp.task('default', ['dev']);
