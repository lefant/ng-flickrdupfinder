var browserSync = require('browser-sync')
var gulp = require('gulp')

var browserify = require('browserify')
var watchify = require('watchify')
var bundleLogger = require('./gulp/util/bundleLogger')
var handleErrors = require('./gulp/util/handleErrors')
var source = require('vinyl-source-stream')

var runSequence = require('run-sequence')

var rimraf = require('gulp-rimraf')
var deploy = require('gulp-gh-pages')

var changed = require('gulp-changed')
var imagemin = require('gulp-imagemin')

/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/

gulp.task('browserify', function () {
  var b = browserify({
    entries: ['./src/javascript/app.js'],
    extensions: ['.js'],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true,
  })

  var bundler = global.isWatching ? watchify(b) : b

  var bundle = function () {
    // Log when bundling starts
    bundleLogger.start()

    return (
      bundler
        .bundle()
        // Report compile errors
        .on('error', handleErrors)
        // Use vinyl-source-stream to make the
        // stream gulp compatible. Specifiy the
        // desired output filename here.
        .pipe(source('app.js'))
        // Specify the output destination
        .pipe(gulp.dest('./build/'))
        // Log when bundling completes!
        .on('end', bundleLogger.end)
    )
  }

  if (global.isWatching) {
    // Rebundle with watchify on changes.
    bundler.on('update', bundle)
  }

  return bundle()
})

gulp.task('images', function () {
  var dest = './build/images'

  return gulp
    .src('./src/images/**')
    .pipe(changed(dest)) // Ignore unchanged files
    .pipe(imagemin()) // Optimize
    .pipe(gulp.dest(dest))
})

gulp.task('markup', function () {
  return gulp.src('src/htdocs/**').pipe(gulp.dest('build'))
})

gulp.task('build', gulp.series('browserify', 'images', 'markup'))

gulp.task(
  'browserSync',
  gulp.series('build', function () {
    browserSync.init(['build/**'], {
      server: {
        baseDir: ['build', 'src'],
      },
    })
  })
)

gulp.task('clean-build', function (callback) {
  runSequence('clean', 'build', callback)
})

gulp.task('clean', function () {
  return gulp
    .src('./build', { read: false }) // much faster
    .pipe(rimraf())
})

gulp.task(
  'deploy',
  gulp.series('clean-build', function () {
    gulp.src('./build/**/*').pipe(
      deploy({
        cacheDir: '../ng-flickrdupfinder_gh-pages',
      })
    )
  })
)

gulp.task(
  'deploy-travis',
  gulp.series('clean-build', function () {
    gulp.src('./build/**/*').pipe(
      deploy({
        remoteUrl: 'git@github.com:lefant/ng-flickrdupfinder.git',
      })
    )
  })
)

gulp.task('setWatch', function () {
  global.isWatching = true
})

/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js automatically reloads any files
     that change within the directory it's serving from
*/

gulp.task(
  'watch',
  gulp.series('setWatch', 'browserSync', function () {
    gulp.watch('src/images/**', ['images'])
    gulp.watch('src/htdocs/**', ['markup'])
  })
)
