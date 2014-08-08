var gulp = require("gulp");
var gutil = require('gulp-util');
var source = require("vinyl-source-stream");
var browserify = require("browserify");
var debowerify = require("debowerify");
var watchify = require('watchify');

gulp.task("browserify", function () {
  return browserify("./app/js/app.js", { insertGlobals:  true })
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./dist/"));
});


gulp.task("watch", function () {
  var bundler = watchify(browserify('./app/js/app.js', watchify.args));

  // Optionally, you can apply transforms
  // and other configuration options on the
  // bundler just as you would with browserify
  //bundler.transform('brfs')

  bundler.on('update', rebundle)

  function rebundle () {
    return bundler.bundle()
      // log errors if they happen
      .on('error', function(e) {
        gutil.log('Browserify Error', e);
      })
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./dist'))
  }

  return rebundle()
})
