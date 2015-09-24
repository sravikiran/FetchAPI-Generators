var gulp = require('gulp'),
	babel=require('gulp-babel'),
	gls = require('gulp-live-server');

gulp.task('liveServer', function(){
	var server = gls.new('server.js');
	server.start();
});

gulp.task('babel', function(){
	return gulp.src(['app.js'])
				.pipe(babel())
				.pipe(gulp.dest('es5'));
});

gulp.task('watch', function(){
	return gulp.watch('app.js', ['babel']);
});

gulp.task('default', ['babel','watch','liveServer']);
