"use strict";

var gulp = require('gulp'),
    // HELPERS
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    // HTML
    fileinclude = require('gulp-file-include'),
    insertLines = require('gulp-insert-lines'),
    htmlmin = require('gulp-htmlmin'),
    // SASS
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    // JS
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),
    webpackDevConfig = require('./webpack.dev.config'),
    uglify = require('gulp-uglify'),
    // IMAGES
    imagemin = require('gulp-imagemin'),
    // SVGS
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    // WATCH and CONNECT
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch'),
    WebpackDevServer = require('webpack-dev-server');

var path = {
  HTML: [
    './assets/html/index.html',
    './assets/html/**/*.html'
  ],
  STYLESHEETS: [
    './assets/style/style.sass',
    './assets/style/**/*.scss',
    './assets/style/**/*.sass'
  ],
  ENTRY: './assets/js/gateway.js',
  SVG: './assets/svgs/*.svg',
  JS: './assets/js/**/*.js',
  IMAGES: './assets/images/*',
  FONTS: [
    './assets/fonts/*.woff2',
  	'./assets/fonts/*.woff',
  	'./assets/fonts/*.ttf'
  ],
  VIDEOS: [
    './assets/videos/*.mp4',
    './assets/videos/*.ogv',
    './assets/videos/*.webm'
  ],
  INBOUND: './builds/inbound/*',
  OUTBOUND: './builds/outbound/*'
};

// HTML TASKS ---------------------------------------------------->>>>>>>>

gulp.task('html-in', function () {
  gulp.src('./assets/html/index.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(insertLines({
      'before': /<\/body>$/,
      'lineBefore': '<script src="http://localhost:8080/mashup.js"></script>'
    }))
    .pipe(gulp.dest('./builds/inbound/'))
    .pipe(connect.reload());
});

gulp.task('html-out', function () {
  gulp.src('./assets/html/index.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(insertLines({
      'before': /<\/body>$/,
      'lineBefore': '<script src="mashup.js"></script>'
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./builds/outbound/'));
});

// STYLE SHEET TASKS ---------------------------------------------------->>>>>>>>

gulp.task('style-in', function() {
	gulp.src(path.STYLESHEETS)
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'expanded', lineNumbers : true }).on('error', sass.logError))
		.pipe(autoprefixer('last 2 versions', 'safari 5', 'ie8', 'ie9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(concat('style.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./builds/inbound/'))
		.pipe(connect.reload());
});

gulp.task('style-out', function() {
	gulp.src(path.STYLESHEETS)
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer('last 2 versions', 'safari 5', 'ie8', 'ie9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./builds/outbound/'));
});

// JAVASCRIPT TASKS ---------------------------------------------------->>>>>>>>

gulp.task("webpack-in", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackDevConfig);

	// Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
    contentBase: "http://localhost:9090/",
    hot: true,
    historyApiFallback: true,
    proxy: {
      "*": "http://localhost:9090"
    },
		publicPath: "http://localhost:8080/",
		stats: {
			colors: true
		},
	}).listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
	});
});

gulp.task('webpack-out', function() {
  return gulp.src('./assets/js/gateway.js')
  .pipe(webpackStream( require('./webpack.pro.config')))
  .pipe(gulp.dest('./builds/outbound/'));
});

// SVG TASKS ---------------------------------------------------->>>>>>>>

gulp.task('svg-in', function() {
    gulp.src(path.SVG)
    	.pipe(rename({prefix: 'svg-'}))
    	.pipe(svgstore())
    	.pipe(rename('defs.svg'))
    	.pipe(gulp.dest('./builds/inbound/svgs'))
    	.pipe(connect.reload());
});

gulp.task('svg-out', function() {
    gulp.src(path.SVG)
    	.pipe(rename({prefix: 'svg-'}))
      .pipe(svgstore())
    	.pipe(rename('defs.svg'))
    	.pipe(gulp.dest('./builds/outbound/svgs'))
});

// IMAGE TASKS ---------------------------------------------------->>>>>>>>

gulp.task('img-in', function() {
	gulp.src( path.IMAGES )
	.pipe(gulp.dest('./builds/inbound/img'))
});

gulp.task('img-out', function() {
	gulp.src( path.IMAGES )
	.pipe(imagemin())
	.pipe(gulp.dest('./builds/outbound/img'))
});

// FONT TASKS ---------------------------------------------------->>>>>>>>

gulp.task('fonts-in', function() {
	gulp.src( path.FONTS )
	.pipe(gulp.dest('./builds/inbound/fonts'))
});

gulp.task('fonts-out', function() {
	gulp.src( path.FONTS )
	.pipe(gulp.dest('./builds/outbound/fonts'))
});

// FONT TASKS ---------------------------------------------------->>>>>>>>

gulp.task('video-in', function() {
	gulp.src( path.VIDEOS )
	.pipe(gulp.dest('./builds/inbound/videos'))
});

gulp.task('video-out', function() {
	gulp.src( path.VIDEOS )
	.pipe(gulp.dest('./builds/outbound/videos'))
});


// OPERATIONAL TASKS ---------------------------------------------------->>>>>>>>

gulp.task('clean-in', function() {
  return gulp.src(path.INBOUND, {read: false})
    .pipe(clean());
});

gulp.task('clean-out', function() {
  return gulp.src(path.OUTBOUND, {read: false})
    .pipe(clean());
});

gulp.task('connect', function() {
  connect.server({
    root: './builds/inbound',
    port: 9090,
    livereload: true
  });
});

gulp.task('watch', function() {
  gulp.watch([path.HTML], ['html-in']);
  gulp.watch([path.STYLESHEETS], ['style-in']);
  gulp.watch([path.SVG], ['svg-in', 'html-in']);
});

gulp.task('default', ['svg-in', 'html-in', 'style-in', 'webpack-in', 'img-in', 'fonts-in', 'connect', 'watch']);

gulp.task('outbound', ['svg-out', 'html-out', 'style-out', 'webpack-out', 'img-out', 'fonts-out']);

gulp.task('clean', ['clean-in', 'clean-out']);
