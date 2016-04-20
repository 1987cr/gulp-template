'use strict';

/*
|--------------------------------------------------------------------------
| Require
|--------------------------------------------------------------------------
*/

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var csscomb = require('gulp-csscomb');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var del = require('del');
var runSequence = require('run-sequence');
// PostCSS plugins
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
		.pipe(csscomb())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("./app/css/"))
		.pipe(browserSync.reload({
	      stream: true
	    }));
});

/*
|--------------------------------------------------------------------------
| Concat and Minify CSS & JS
|--------------------------------------------------------------------------
*/

gulp.task('useref', function() {
	var processors = [
		cssnano
	];

	return gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', postcss(processors)))
		.pipe(gulp.dest('dist'));
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
		}
	});
});

/*
|--------------------------------------------------------------------------
| Watch CSS, HTML & JS
|--------------------------------------------------------------------------
*/

gulp.task('watch', function(){
	gulp.watch('app/devcss/**/*.css', ['css']); 
	gulp.watch('app/*.html', browserSync.reload); 
  	gulp.watch('app/js/**/*.js', browserSync.reload); 
});

/*
|--------------------------------------------------------------------------
| Clean
|--------------------------------------------------------------------------
*/

gulp.task('clean', function() {
	return del.sync('dist').then(function(cb) {
		return cache.clearAll(cb);
	});
})

gulp.task('clean:dist', function() {
	return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

/*
|--------------------------------------------------------------------------
| Build
|--------------------------------------------------------------------------
*/

gulp.task('build', function(callback) {
	runSequence('clean:dist', ['css', 'useref'], callback);
});

/*
|--------------------------------------------------------------------------
| Default Task
|--------------------------------------------------------------------------
*/

gulp.task('default', function(callback) {
	runSequence(['css', 'browserSync', 'watch'], callback);
});

