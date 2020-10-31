'use strict';
const source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	browserSync = require('browser-sync').create(),
	browserify = require('browserify'),
	uglify = require('gulp-uglify'),
	umd = require('gulp-umd'),
	terser = require('gulp-terser'),
	size = require('gulp-size'),
	pug = require('gulp-pug'),
	babel = require('gulp-babel');

//----- Config -----//
var build = './',
	src = './src/';

// SASS
gulp.task('sass', function () {
	return gulp.src(src + 'scss/style.scss')
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 40 versions'],
			cascade: true
		}))
		.pipe(cleanCSS())
		.pipe(gulp.dest(build + 'css/'))
		.pipe(browserSync.stream());
});

// Pug
gulp.task('pug', function () {
	return gulp.src(src + 'pug/index.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest(build))
		.pipe(browserSync.stream());
});

// Lib folder with module
gulp.task('bundle-js', () => {
	return gulp.src([src + 'js/scroll-window-to-element.js', src + 'js/animate.js'])
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(gulp.dest('./lib'))
		.pipe(browserSync.stream());
});

// Demo
gulp.task('demo-js', function () {
	return browserify(src + 'js/demo.js')
		.transform('babelify', { presets: ['@babel/env'] })
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest(build + 'js/'))
		.pipe(browserSync.stream());
});

// Watch
gulp.task('watch', function () {
	browserSync.init({
		server: {
			baseDir: build
		},
		port: 5000
	});
	gulp.watch(src + 'scss/*.scss', gulp.series('sass'));
	gulp.watch([src + 'pug/**/*.pug', src + 'pug/includes/*.pug'], gulp.series('pug'));
	gulp.watch(src + 'js/**/*.js', gulp.series('demo-js'));
});

gulp.task('js:umd', function () {
	const nameFn = file => 'ScrollToElement';
	return gulp.src('./src/js/scroll-window-to-element.js')
		.pipe(babel({ presets: ['@babel/env'] }))
		.pipe(umd({
			exports: nameFn,
			namespace: nameFn,
		}))
		// .pipe(uglify())
		// .pipe(terser())
		.pipe(size())
		.pipe(gulp.dest('build'));
});

gulp.task('js:umd:es6', function () {
	const nameFn = file => 'ScrollToElement';
	return gulp.src('./src/js/scroll-window-to-element.js')
		.pipe(umd({
			exports: nameFn,
			namespace: nameFn,
		}))
		// .pipe(terser())
		.pipe(size())
		.pipe(gulp.dest('build-es6'));
});

// default
gulp.task('default', gulp.series(gulp.parallel('pug', 'sass', 'demo-js', 'bundle-js'), 'watch'));

