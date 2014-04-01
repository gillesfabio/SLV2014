'use strict';

var path      = require('path');
var gulp      = require('gulp');
var concat    = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var sass      = require('gulp-sass');
var clean     = require('gulp-clean');
var uglify    = require('gulp-uglify');
var rjs       = require('gulp-requirejs');
var express   = require('express');
var swig      = require('swig');
var tempWrite = require('temp-write');
var Generator = require('./generator');

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

var BASE_URL = process.env.BASE_URL ? process.env.BASE_URL : '/';
var SERVER_PORT = 3000;

var STYLESHEETS = [
  'vendor/font-awesome/css/font-awesome.min.css',
  'src/stylesheets/css/main.css'
];

// From build directory
var STYLESHEETS_COMPILED = [
  'css/styles.css'
];

var FONTS = [
  'vendor/font-awesome/fonts/**'
];

// -----------------------------------------------------------------------------
// Template context
// -----------------------------------------------------------------------------

var context = {
  env         : 'development',
  baseurl     : BASE_URL,
  stylesheets : STYLESHEETS,
  rjs         : BASE_URL + 'vendor/requirejs/require.js',
  rjsmain     : BASE_URL + 'src/main'
};

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

// -----------------------------------------------------------------------------
// Compilation Tasks
// -----------------------------------------------------------------------------

gulp.task('compile:data', function() {
  var generator = new Generator();
  generator.build();
});

gulp.task('compile:index', function() {
  var cxt         = Object.create(context);
  cxt.env         = 'production';
  cxt.stylesheets = STYLESHEETS_COMPILED;
  cxt.rjs         = BASE_URL + 'js/require.js';
  cxt.rjsmain     = BASE_URL + 'js/main-built';
  var compiled    = customSwig.compileFile(path.join(__dirname, 'views', 'index.html'));
  var tpl         = compiled(cxt);
  var file        = tempWrite.sync(tpl, 'index.html');
  return gulp.src(file)
    .pipe(gulp.dest('build/html'));
});

gulp.task('compile:stylesheets', function() {
  return gulp.src('./src/stylesheets/sass/*.scss')
    .pipe(sass({includePaths: ['./vendor/foundation/scss']}))
    .pipe(gulp.dest('./src/stylesheets/css'));
});

gulp.task('compile:javascripts', function() {
  return rjs({
    baseUrl        : __dirname,
    out            : 'main-built.js',
    name           : 'src/main',
    mainConfigFile : 'src/main.js'
  })
  .pipe(uglify())
  .pipe(gulp.dest('./build/js'));
});

gulp.task('compile:favicon', function() {
  return gulp.src('./src/images/favicon.ico')
    .pipe(gulp.dest('./build/images'));
});

gulp.task('compile:images', function() {
  return gulp.src('./data/pictures/*.jpg')
    .pipe(gulp.dest('./build/images'));
});

gulp.task('compile', [
  'compile:data',
  'compile:index',
  'compile:stylesheets',
  'compile:javascripts',
  'compile:favicon',
  'compile:images'
]);

// -----------------------------------------------------------------------------
// Build "public" directory
// -----------------------------------------------------------------------------

gulp.task('public:data', ['compile:data'], function() {
  return gulp.src('build/data/*.json')
    .pipe(gulp.dest('public/data'));
});

gulp.task('public:index', ['compile:index'], function() {
  return gulp.src('build/html/index.html')
    .pipe(gulp.dest('public'));
});

gulp.task('public:fonts', function() {
  return gulp.src(FONTS)
    .pipe(gulp.dest('public/fonts'));
});

gulp.task('public:images', ['compile:images'], function() {
  return gulp.src('./build/images/*.jpg')
    .pipe(gulp.dest('./public/images'));
});

gulp.task('public:favicon', ['compile:favicon'], function() {
  return gulp.src('./build/images/favicon.ico')
    .pipe(gulp.dest('./public/images'));
});

gulp.task('public:requirejs', function() {
  return gulp.src('./vendor/requirejs/require.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('public:javascripts', [
  'public:requirejs',
  'compile:javascripts'
], function() {
  return gulp.src('./build/js/*.js')
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('public:stylesheets', ['compile:stylesheets'], function() {
  return gulp.src(STYLESHEETS)
    .pipe(concat('styles.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/css'));
});

gulp.task('public:cname', function() {
  var file = tempWrite.sync('slv2014.fr', 'CNAME');
  return gulp.src(file)
    .pipe(gulp.dest('public'));
});

gulp.task('public', [
  'public:data',
  'public:index',
  'public:fonts',
  'public:images',
  'public:favicon',
  'public:javascripts',
  'public:stylesheets',
  'public:cname'
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
  gulp.watch([
    'src/**/*.js',
    'src/stylesheets/sass/*.scss',
    'src/**/*.hbs',
    'data/**',
    'views/*.html',
    'test/**'
  ], ['compile:stylesheets']);
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
      server.use(express.static(path.join(__dirname, 'build')));
      server.use(express.static(path.join(__dirname, 'src')));
      server.use(express.static(__dirname));
      server.get('*', function(req, res) { res.render('index', context); });
      server.listen(SERVER_PORT);
    break;
    case 'test':
      context.env = 'test';
      server.engine('html', customSwig.renderFile);
      server.set('view engine', 'html');
      server.set('views', path.join(__dirname, 'views'));
      server.use(express.static(path.join(__dirname, 'build')));
      server.use(express.static(path.join(__dirname, 'src')));
      server.use(express.static(path.join(__dirname, 'test', 'frontend')));
      server.use(express.static(__dirname));
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
  'public'
]);

gulp.task('serve', [
  'compile',
  'watch'
], function() {
  serve('development');
});

gulp.task('serve:test', [
  'clean',
  'compile',
  'watch'
], function() {
  serve('test');
});

gulp.task('serve:production', ['clean', 'public'], function() {
  serve('production');
});
