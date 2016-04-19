'use strict';

/*
|--------------------------------------------------------------------------
| Require
|--------------------------------------------------------------------------
*/

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');

var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');
var rucksack = require('rucksack-css');
var vars = require('postcss-simple-vars');
var nested = require('postcss-nested');

/*
|--------------------------------------------------------------------------
| CSS
|--------------------------------------------------------------------------
*/

gulp.task('css', function(){
	var processors = [
		vars,
        nested,
        rucksack,
        autoprefixer
	];

	return gulp.src("./app/devcss/**/*.css")
	 	.pipe(sourcemaps.init())
		.pipe(postcss(processors))
		.pipe(sourcemaps.write())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest("./app/css/"))
		.pipe(browserSync.reload({
	      stream: true
	    }));
});

gulp.task('css-build', function(){
	var processors = [
		vars,
        nested,
        rucksack,
        autoprefixer,
        cssnano
	];

	return gulp.src("./app/devcss/**/*.css")
	 	.pipe(sourcemaps.init())
		.pipe(postcss(processors))
		.pipe(sourcemaps.write())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest("./dist/css/"));
});
/*
|--------------------------------------------------------------------------
| JS
|--------------------------------------------------------------------------
*/

gulp.task('js', function(){
	return gulp.src('./app/devjs/**/*.js')
	    .pipe(uglify())
	    .pipe(rename({suffix: '.min'}))
	    .pipe(gulp.dest('./app/js/'))
	    .pipe(browserSync.reload({
	      stream: true
	    }));
});

gulp.task('js-build', function(){
  return gulp.src('./app/js/**/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/js/'));
});

/*
|--------------------------------------------------------------------------
| HTML
|--------------------------------------------------------------------------
*/

gulp.task('html', function(){
  return gulp.src('./app/index.html')
    .pipe(gulp.dest('./dist/'));
});


/*
|--------------------------------------------------------------------------
| BrowserSync
|--------------------------------------------------------------------------
*/

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

/*
|--------------------------------------------------------------------------
| Watch CSS, HTML & JS
|--------------------------------------------------------------------------
*/

gulp.task('watch', ['browserSync'], function(){
	gulp.watch('app/devcss/**/*.css', ['css']); 
	gulp.watch('app/*.html', browserSync.reload); 
  	gulp.watch('app/devjs/**/*.js', ['js']); 
});

/*
|--------------------------------------------------------------------------
| Default Task
|--------------------------------------------------------------------------
*/

gulp.task("default", ["css-build", "js-build", "html"]);