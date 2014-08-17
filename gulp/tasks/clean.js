var gulp = require('gulp');
var rimraf = require('gulp-rimraf');

gulp.task('clean', function() {
  return gulp.src('./build', { read: false }) // much faster
    .pipe(rimraf());
});
