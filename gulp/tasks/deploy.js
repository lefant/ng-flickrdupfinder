var gulp = require('gulp');
var deploy = require("gulp-gh-pages");

gulp.task('deploy', ['clean-build'], function () {
    gulp.src("./build/**/*")
        .pipe(deploy({
          cacheDir: '../ng-flickrdupfinder_gh-pages'
        }));
});

gulp.task('deploy-travis', ['clean-build'], function () {
    gulp.src("./build/**/*")
        .pipe(deploy({
          remoteUrl: 'git@github.com:lefant/ng-flickrdupfinder.git'
        }));
});
