/* jshint node: true */
'use strict';

var gulp = require('gulp'),
	del = require('del'),
	browserify = require('browserify'),
	vSource = require('vinyl-source-stream'),
	vPaths = require('vinyl-paths'),
	express = require('express');

gulp.task('build', ['clean', 'static', 'browserify']);

gulp.task('clean', function () {
	return gulp.src('./build/*')
		.pipe(vPaths(del));
});

gulp.task('static', ['clean'], function () {
	return gulp.src('./src/static/**')
		.pipe(gulp.dest('./build'));
});

gulp.task('browserify', ['clean'], function () {
	return browserify('./src/js/main.js')
		.bundle()
		.pipe(vSource('bundle.js'))
		.pipe(gulp.dest('./build/'));
});

gulp.task('watch', function () {
	gulp.watch('./src/**', ['build']);
});

gulp.task('serve', function () {
	var app = express();
	app.use(express.static('./build'));
	app.listen(8080);
	console.log('Serving on http://localhost:8080/');
});

gulp.task('dev', ['build', 'watch', 'serve']);