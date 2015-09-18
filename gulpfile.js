var gulp = require('gulp'),
	babel=require('gulp-babel'),
	express=require('gulp-express');

gulp.task('server', function () {
    return express.run(['server.js']);
});

gulp.task('babel', function(){
	return gulp.src(['app.js'])
				.pipe(babel())
				.pipe(gulp.dest('es5'));
});

gulp.task('watch', function(){
	return gulp.watch('app.js', ['babel']);
});

gulp.task('default', ['watch','server']);
