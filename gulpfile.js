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
var Generator = require('./generator');

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
  'vendor/underscore.string/dist/underscore.string.min.js',
  'vendor/backbone/backbone.js',
  'vendor/handlebars/handlebars.min.js',
  'vendor/markdown/lib/markdown.js',
  'vendor/countdownjs/countdown.min.js',
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
// Compilation Tasks
// -----------------------------------------------------------------------------

gulp.task('compile:data', function() {
  var generator = new Generator();
  var data = generator.build();
  var json = JSON.stringify(data, null, 2);
  var file = tempWrite.sync(json, 'data.json');
  return gulp.src(file)
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
  return gulp.src('./src/*.scss')
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

gulp.task('public:data', function() {
  return gulp.src('build/data/data.json')
    .pipe(gulp.dest('public'));
});

gulp.task('public:index', function() {
  return gulp.src('build/html/index.html')
    .pipe(gulp.dest('public'));
});

gulp.task('public:fonts', function() {
  return gulp.src(FONTS)
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

gulp.task('public:stylesheets', function() {
  return gulp.src(STYLESHEETS)
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
  gulp.watch(['src/**', 'data/**', 'views/**', 'test/**'], ['compile']);
});

// -----------------------------------------------------------------------------
// Servers
// -----------------------------------------------------------------------------

function serve(env) {
  env = env || 'development';
  var server = express();
  server.use(express.compress());
  server.use(express.json());
  server.use(express.urlencoded());
  server.set('view cache', false);
  switch(env) {
    case 'development':
      context.env = 'development';
      server.engine('html', customSwig.renderFile);
      server.set('view engine', 'html');
      server.set('views', path.join(__dirname, 'views'));
      server.use(express.static(path.join(__dirname, 'build', 'data')));
      server.use(express.static(__dirname));
      server.get('*', function(req, res) { res.render('index', context); });
      server.listen(SERVER_PORT);
    break;
    case 'test':
      context.env = 'test';
      server.use(express.static(__dirname));
      server.use(express.static(path.join(__dirname, 'build', 'data')));
      server.use(express.static(path.join(__dirname, 'test')));
      server.listen(SERVER_PORT);
    break;
    case 'production':
      context.env = 'production';
      server.use(express.static(path.join(__dirname, 'public')));
      server.listen(SERVER_PORT);
    break;
  }
  console.log('Express server listening to on port ' + SERVER_PORT + '...');
}

// -----------------------------------------------------------------------------
// Top Level Tasks
// -----------------------------------------------------------------------------

gulp.task('build', [
  'clean:build',
  'compile'
]);

gulp.task('generate', [
  'clean',
  'compile',
  'public'
]);

gulp.task('serve', ['compile', 'watch'], function() {
  serve('development');
});

gulp.task('serve:test', ['clean', 'compile', 'watch'], function() {
  serve('test');
});

gulp.task('serve:production', ['clean', 'compile', 'public'], function() {
  serve('production');
});
