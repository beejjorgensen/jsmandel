var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
//var watchify = require('watchify');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');

function js_dist() {

	var b = browserify({
		entries: './src/js/mandelbrot.js',
		debug: true
	});

	return b.transform('babelify',{presets: ['es2015']}).bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./build/dist'));
}

function js_debug() {

	var b = browserify({
		entries: './src/js/mandelbrot.js',
		debug: true
	});

	return b.transform('babelify',{presets: ['es2015']}).bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		//.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./build/debug'));
}

function css_dist() {
	return gulp.src('./src/css/*.css')
		.pipe(cleanCSS())
		.pipe(gulp.dest('./build/dist'));

}

function css_debug() {
	return gulp.src('./src/css/*.css')
		.pipe(gulp.dest('./build/debug'));

}

function cp_files_dist() {
	return gulp.src(['./src/*.html'])
		.pipe(gulp.dest('./build/dist'));
}

function cp_files_debug() {
	return gulp.src(['./src/*.html'])
		.pipe(gulp.dest('./build/debug'));
}

gulp.task('cp_files_dist', cp_files_dist);
gulp.task('cp_files_debug', cp_files_debug);

gulp.task('css_dist', css_dist);
gulp.task('css_debug', css_debug);

gulp.task('js_dist', js_dist);
gulp.task('js_debug', js_debug);

gulp.task('dist', ['js_dist', 'css_dist', 'cp_files_dist']);
gulp.task('default', ['js_debug', 'css_debug', 'cp_files_debug']);

