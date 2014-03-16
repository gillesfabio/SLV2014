'use strict';

var fs        = require('fs');
var path      = require('path');
var concat    = require('gulp-concat');
var express   = require('express');
var gulp      = require('gulp');
var minifyCSS = require('gulp-minify-css');
var compass   = require('gulp-compass');
var clean     = require('gulp-clean');
var swig      = require('swig');
var tempWrite = require('temp-write');
var _         = require('lodash');
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

gulp.task('compile:data', function(cb) {
  generator.buildData(function(err, data) {
    if (err) throw new Error(err);
    var json = JSON.stringify(data, null, 2);
    if (!fs.existsSync(BUILD_DIR)) fs.mkdirSync(BUILD_DIR);
    var src  = fs.createReadStream(tempWrite.sync(json, 'data.json'));
    var dest = fs.createWriteStream(path.join(BUILD_DIR, 'data.json'));
    src.pipe(dest);
    src.on('end', function() {
      return cb();
    });
  });
});

gulp.task('compile:index', function() {
  var compiled = customSwig.compileFile(path.join(VIEWS_DIR, 'index.html'));
  var tpl = compiled(context);
  var file = tempWrite.sync(tpl, 'index.html');
  return gulp.src(file)
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('compile:stylesheets', function() {
  return gulp.src('./src/*.scss')
    .pipe(compass({
      project     : __dirname,
      css         : 'build/compass',
      sass        : 'src',
      image       : 'src/images',
      import_path : ['vendor/foundation/scss']
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(path.join(BUILD_DIR, 'css')));
});

gulp.task('compile:javascripts:modernizr', function() {
  return gulp.src(MODERNIZR)
    .pipe(gulp.dest(path.join(BUILD_DIR, 'js')));
});

gulp.task('compile:javascripts', ['compile:javascripts:modernizr'], function() {
  return gulp.src(JAVASCRIPTS)
    .pipe(concat(JAVASCRIPTS_CONCAT))
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

gulp.task('public:data', function() {
  return gulp.src(path.join(BUILD_DIR, 'data.json'))
    .pipe(gulp.dest(PUBLIC_DIR));
});

gulp.task('public:index', ['compile:index'], function() {
  return gulp.src(path.join(BUILD_DIR, 'index.html'))
    .pipe(gulp.dest(PUBLIC_DIR));
});

gulp.task('public:fonts', function() {
  return gulp.src(FONTS)
    .pipe(gulp.dest(path.join(PUBLIC_DIR, 'fonts')));
});

gulp.task('public:javascripts:modernizr', function() {
  return gulp.src(MODERNIZR)
    .pipe(gulp.dest(path.join(PUBLIC_DIR, 'js')));
});

gulp.task('public:javascripts', ['public:javascripts:modernizr'], function() {
  return gulp.src(JAVASCRIPTS)
    .pipe(concat(JAVASCRIPTS_CONCAT))
    .pipe(gulp.dest(path.join(PUBLIC_DIR, 'js')));
});

gulp.task('public:stylesheets', function() {
  return gulp.src(path.join(BUILD_DIR, 'css/**'))
    .pipe(minifyCSS())
    .pipe(concat(STYLESHEETS_CONCAT))
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
  return gulp.src(BUILD_DIR, {read: false})
    .pipe(clean({force: true}));
});

gulp.task('clean:public', function() {
  return gulp.src(PUBLIC_DIR, {read: false})
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

gulp.task('server:development', ['compile:data', 'compile:stylesheets'], function() {
  context.env = 'development';
  var json = require(path.join(BUILD_DIR, 'data.json'));
  server.engine('html', customSwig.renderFile);
  server.set('view engine', 'html');
  server.set('views', path.join(__dirname, 'views'));
  server.use(express.static(__dirname));
  server.get('/data.json', function(req, res) { res.send(json); });
  server.get('*', function(req, res) { res.render('index', context); });
  server.listen(SERVER_PORT);
});

gulp.task('server:test', ['compile:data'], function() {
  context.env = 'development';
  var json = require(path.join(BUILD_DIR, 'data.json'));
  server.use(express.static(__dirname));
  server.get('/data.json', function(req, res) { res.send(json); });
  server.get('*', function(req, res) { res.sendfile('test/index.html'); });
  server.listen(SERVER_PORT);
});

gulp.task('server:production', ['clean:public', 'compile', 'public'], function() {
  server.use(express.static(PUBLIC_DIR));
  server.get('*', function(req, res) { res.sendfile(path.join(PUBLIC_DIR, 'index.html')); });
  server.listen(SERVER_PORT);
});

// -----------------------------------------------------------------------------
// Top Level Tasks
// -----------------------------------------------------------------------------

gulp.task('build', ['clean:build', 'compile']);
gulp.task('generate', ['clean:build', 'clean:public', 'compile', 'public']);
gulp.task('serve', ['server:development', 'watch']);
gulp.task('serve:test', ['server:test']);
gulp.task('serve:production', ['server:production', 'watch']);
