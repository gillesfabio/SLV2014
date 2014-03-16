'use strict';

var path      = require('path');
var gulp      = require('gulp');
var concat    = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var compass   = require('gulp-compass');
var clean     = require('gulp-clean');
var uglify    = require('gulp-uglify');
var express   = require('express');
var swig      = require('swig');
var tempWrite = require('temp-write');
var generator = require('./generator');

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

var BASE_URL    = process.env.BASE_URL ? process.env.BASE_URL : '/';
var SERVER_PORT = 3000;
var MODERNIZR   = 'vendor/foundation/js/vendor/modernizr.js';
var JAVASCRIPTS = [
  'vendor/jquery/dist/jquery.min.js',
  'vendor/foundation/js/foundation.min.js',
  'vendor/underscore/underscore.js',
  'vendor/backbone/backbone.js',
  'vendor/handlebars/handlebars.min.js',
  'vendor/jspdf/dist/jspdf.min.js',
  'vendor/markdown/lib/markdown.js',
  'src/app.js'
];
var STYLESHEETS = [
  'vendor/font-awesome/css/font-awesome.min.css',
  'build/css/app.css'
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
  env       : 'production',
  modernizr : MODERNIZR,
  scripts   : JAVASCRIPTS,
  styles    : STYLESHEETS,
  baseurl   : BASE_URL
};

// -----------------------------------------------------------------------------
// Express Server (defaults)
// -----------------------------------------------------------------------------

var server = express();
server.use(express.compress());
server.use(express.json());
server.use(express.urlencoded());
server.set('view cache', false);

// -----------------------------------------------------------------------------
// Compilation Tasks
// -----------------------------------------------------------------------------

gulp.task('compile:data', function() {
  var data = generator.buildData();
  var json = JSON.stringify(data, null, 2);
  var file = tempWrite.sync(json, 'data.json');
  gulp.src(file)
    .pipe(gulp.dest('build/data'));
});

gulp.task('compile:index', function() {
  var compiled = customSwig.compileFile(path.join(__dirname, 'views', 'index.html'));
  var tpl = compiled(context);
  var file = tempWrite.sync(tpl, 'index.html');
  return gulp.src(file)
    .pipe(gulp.dest('build/html'));
});

gulp.task('compile:stylesheets', function() {
  gulp.src('./src/*.scss')
    .pipe(compass({
      project     : __dirname,
      css         : 'build/css',
      sass        : 'src',
      image       : 'src/images',
      import_path : ['vendor/foundation/scss']
    }));
});

gulp.task('compile', [
  'compile:data',
  'compile:index',
  'compile:stylesheets'
]);

// -----------------------------------------------------------------------------
// Build "public" directory
// -----------------------------------------------------------------------------

gulp.task('public:data', ['compile:data'], function() {
  gulp.src('build/data/data.json')
    .pipe(gulp.dest('public'));
});

gulp.task('public:index', ['compile:index'], function() {
  gulp.src('build/html/index.html')
    .pipe(gulp.dest('public'));
});

gulp.task('public:fonts', function() {
  gulp.src(FONTS)
    .pipe(gulp.dest('public/fonts'));
});

gulp.task('public:javascripts', function() {
  gulp.src(MODERNIZR)
    .pipe(gulp.dest('public/js'));
  gulp.src(JAVASCRIPTS)
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('public:stylesheets', ['compile:stylesheets'], function() {
  gulp.src(STYLESHEETS)
    .pipe(concat('styles.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/css'));
});

gulp.task('public', [
  'public:data',
  'public:index',
  'public:fonts',
  'public:javascripts',
  'public:stylesheets'
]);

// -----------------------------------------------------------------------------
// Clean Tasks
// -----------------------------------------------------------------------------

gulp.task('clean:build', function() {
  return gulp.src('build')
    .pipe(clean({force: true}));
});

gulp.task('clean:public', function() {
  return gulp.src('public')
    .pipe(clean({force: true}));
});

gulp.task('clean', [
  'clean:build',
  'clean:public'
]);

// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------

gulp.task('watch', function() {
  gulp.watch(['src/**', 'data/**', 'views/**'], ['compile']);
});

// -----------------------------------------------------------------------------
// Servers
// -----------------------------------------------------------------------------

gulp.task('server:development', function() {
  context.env = 'development';
  server.engine('html', customSwig.renderFile);
  server.set('view engine', 'html');
  server.set('views', path.join(__dirname, 'views'));
  server.use(express.static(__dirname));
  server.use(express.static(path.join(__dirname, 'build', 'data')));
  server.get('*', function(req, res) { res.render('index', context); });
  server.listen(SERVER_PORT);
  console.log('Express server listen on port ' + SERVER_PORT + '...');
});

gulp.task('server:test', function() {
  context.env = 'development';
  server.use(express.static(__dirname));
  server.use(express.static(path.join(__dirname, 'build')));
  server.get('*', function(req, res) { res.sendfile('test/index.html'); });
  server.listen(SERVER_PORT);
  console.log('Express server listen on port ' + SERVER_PORT + '...');
});

gulp.task('server:production', function() {
  server.use(express.static(path.join(__dirname, 'public')));
  //server.get('*', function(req, res) { res.sendfile(path.join(__dirname, 'public', 'index.html')); });
  console.log('Express server listen on port ' + SERVER_PORT + '...');
  server.listen(SERVER_PORT);
});

// -----------------------------------------------------------------------------
// Top Level Tasks
// -----------------------------------------------------------------------------

gulp.task('build', [
  'clean:build',
  'compile'
]);

gulp.task('generate', [
  'clean:build',
  'clean:public',
  'public'
]);

gulp.task('serve', [
  'compile',
  'server:development',
  'watch'
]);

gulp.task('serve:test', [
  'compile:data',
  'server:test'
]);

gulp.task('serve:production', [
  'clean:build',
  'clean:public',
  'public',
  'server:production'
]);
