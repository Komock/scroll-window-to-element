'use strict';
var source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	browserSync = require('browser-sync').create(),
	browserify = require('browserify'),
	babelify = require('babelify'),
	uglify = require('gulp-uglify'),
	babel = require('gulp-babel'),
	pug = require('gulp-pug');

//----- Config -----//
var build = './',
	src = './src/';

// SASS
gulp.task('sass', function() {
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
gulp.task('pug', function() {
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
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./lib'))
        .pipe(browserSync.stream());
});

// Demo
gulp.task('demo-js', function() {
	return browserify(src + 'js/demo.js')
		.transform( 'babelify', {presets: ['es2015']} )
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest( build + 'js/' ))
		.pipe(browserSync.stream());
});

// Watch
gulp.task('watch', function() {
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

// default
gulp.task('default', gulp.series( gulp.parallel( 'pug', 'sass', 'demo-js', 'bundle-js' ), 'watch' ) );

