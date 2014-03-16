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

var BASE_URL           = process.env.BASE_URL ? process.env.BASE_URL : '/';
var SERVER_PORT        = 3000;
var BUILD_DIR          = path.join(__dirname, 'build');
var PUBLIC_DIR         = path.join(__dirname, 'public');
var VIEWS_DIR          = path.join(__dirname, 'views');
var JAVASCRIPTS_CONCAT = 'scripts.js';
var STYLESHEETS_CONCAT = 'styles.css';
var MODERNIZR          = 'vendor/foundation/js/vendor/modernizr.js';

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
  'build/compass/app.css'
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
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('compile:index', function() {
  var compiled = customSwig.compileFile(path.join(VIEWS_DIR, 'index.html'));
  var tpl = compiled(context);
  var file = tempWrite.sync(tpl, 'index.html');
  return gulp.src(file)
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('compile:stylesheets', function() {
  gulp.src('./src/*.scss')
    .pipe(compass({
      project     : __dirname,
      css         : 'build/compass',
      sass        : 'src',
      image       : 'src/images',
      import_path : ['vendor/foundation/scss']
    }));
});

gulp.task('compile:javascripts', function() {
  gulp.src(MODERNIZR)
    .pipe(gulp.dest(path.join(BUILD_DIR, 'js')));
  gulp.src(JAVASCRIPTS)
    .pipe(gulp.dest(path.join(BUILD_DIR, 'js')));
});

gulp.task('compile', [
  'compile:data',
  'compile:index',
  'compile:stylesheets',
  'compile:javascripts'
]);

// -----------------------------------------------------------------------------
// Build "public" directory
// -----------------------------------------------------------------------------

gulp.task('public:data', ['compile:data'], function() {
  gulp.src(path.join(BUILD_DIR, 'data.json'))
    .pipe(gulp.dest(PUBLIC_DIR));
});

gulp.task('public:index', ['compile:index'], function() {
  gulp.src(path.join(BUILD_DIR, 'index.html'))
    .pipe(gulp.dest(PUBLIC_DIR));
});

gulp.task('public:fonts', function() {
  gulp.src(FONTS)
    .pipe(gulp.dest(path.join(PUBLIC_DIR, 'fonts')));
});

gulp.task('public:javascripts', function() {
  gulp.src(MODERNIZR)
    .pipe(gulp.dest(path.join(PUBLIC_DIR, 'js')));
  gulp.src(path.join(BUILD_DIR, 'js', '**'))
    .pipe(concat(JAVASCRIPTS_CONCAT))
    .pipe(uglify())
    .pipe(gulp.dest(path.join(PUBLIC_DIR, 'js')));
});

gulp.task('public:stylesheets', ['compile:stylesheets'], function() {
  gulp.src(STYLESHEETS)
    .pipe(concat(STYLESHEETS_CONCAT))
    .pipe(minifyCSS())
    .pipe(gulp.dest(path.join(PUBLIC_DIR, 'css')));
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
  return gulp.src(BUILD_DIR)
    .pipe(clean({force: true}));
});

gulp.task('clean:public', function() {
  return gulp.src(PUBLIC_DIR)
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
  server.use(express.static(BUILD_DIR));
  server.get('*', function(req, res) { res.render('index', context); });
  server.listen(SERVER_PORT);
  console.log('Express server listen on port ' + SERVER_PORT + '...');
});

gulp.task('server:test', function() {
  context.env = 'development';
  var json = require(path.join(BUILD_DIR, 'data.json'));
  server.use(express.static(__dirname));
  server.get('/data.json', function(req, res) { res.send(json); });
  server.get('*', function(req, res) { res.sendfile('test/index.html'); });
  server.listen(SERVER_PORT);
  console.log('Express server listen on port ' + SERVER_PORT + '...');
});

gulp.task('server:production', function() {
  server.use(express.static(PUBLIC_DIR));
  server.get('*', function(req, res) { res.sendfile(path.join(PUBLIC_DIR, 'index.html')); });
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
  'compile:data',
  'compile:stylesheets',
  'server:development',
  'watch'
]);

gulp.task('serve:test', [
  'compile:data',
  'server:test'
]);

gulp.task('serve:production', [
  'clean:public',
  'public',
  'server:production'
]);
