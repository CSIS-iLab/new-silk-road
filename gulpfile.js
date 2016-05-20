'use strict';

var gulp        = require('gulp');
var gutil       = require('gulp-util');
var gulpif      = require('gulp-if');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var babelify    = require('babelify');
var watchify    = require('watchify');
var sourcemaps  = require('gulp-sourcemaps');
var browserify  = require('browserify');
var uglify      = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var cleanCss    = require('gulp-clean-css');
var svgmin      = require('gulp-svgmin');
var concat      = require('gulp-concat');
var rename      = require('gulp-rename');

var assetsBase = './website/assets',
    destBase   = './website/static',
    sassGlob   = '/**/*.scss';

var production = process.env.NODE_ENV === 'production';

// Input file.
watchify.args.debug = !production;
var bundler = watchify(browserify(assetsBase + '/apps/map/app.js', watchify.args));
bundler.transform(babelify.configure({
    sourceMapRelative: 'apps/map',
    presets: ["es2015", "react"],
    plugins: ["transform-class-properties"]
}));
bundler.on('update', bundle);

function bundle() {
    gutil.log('Compiling JS...');

    return bundler.bundle()
        .on('error', function (err) {
            gutil.log(err.message);
            browserSync.notify("Browserify Error!");
            this.emit("end");
        })
        .pipe(source('mapapp.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(gulpif(production, uglify()))
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(destBase + '/js'))
        .pipe(browserSync.stream({once: true}));
}

gulp.task('bundle', function () {
    return bundle();
});

gulp.task('sass', function () {
    var cssDest = destBase + '/css';
    return gulp.src(assetsBase + sassGlob)
               .pipe(sass().on('error', sass.logError))
               .pipe(concat('site.css'))
               .pipe(gulp.dest(cssDest))
               .pipe(rename({ extname: '.min.css' }))
               .pipe(cleanCss())
               .pipe(gulp.dest(cssDest))
});

gulp.task('svg', function () {
    var svgDest = destBase + '/img'
    return gulp.src(assetsBase + '/svg/*.svg')
        .pipe(svgmin({
            plugins: [{
                removeTitle: true
            }, {
                removeRasterImages: true
            }, {
                cleanupNumericValues: {
                    floatPrecision: 2
                }
            }]
        }))
        .pipe(gulp.dest(svgDest));
});


gulp.task('default', ['build'], function () {
    gulp.watch(assetsBase + sassGlob, ['sass']);
    browserSync.init({
        proxy: "localhost:8000",
        serveStatic: [destBase],
        files: [destBase + '/css/*.css'],
        open: false
    });
});

gulp.task('build', ['sass', 'bundle']);

gulp.task('watch', function() {
    gulp.watch(assetsBase + sassGlob, ['sass']);
})
