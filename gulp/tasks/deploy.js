var gulp = require('gulp');
var deploy = require("gulp-gh-pages");

gulp.task('deploy', ['build'], function () {
    gulp.src("./build/**/*")
        .pipe(deploy({}));
});
