var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('clean-build', function(callback) {
  runSequence('clean', 'build', callback);
});
