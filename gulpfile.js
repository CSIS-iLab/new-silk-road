'use strict';

var gulp       = require('gulp'),
    webpack    = require('webpack-stream'),
    babel      = require("gulp-babel"),
    sass       = require('gulp-sass'),
    cleanCss   = require('gulp-clean-css'),
    svgmin     = require('gulp-svgmin'),
    concat     = require('gulp-concat'),
    sourcemaps = require("gulp-sourcemaps"),
    uglify     = require('gulp-uglify'),
    rename     = require('gulp-rename');

var assetsBase = './website/assets',
    destBase   = './website/static',
    sassGlob   = '/**/*.scss';


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

gulp.task('mapapp', function () {
  return gulp.src(assetsBase + '/js/mapapp.js')
    .pipe(sourcemaps.init())
    // .pipe(concat("mapapp.js"))
    .pipe(webpack({
      module: {
        loaders: [
          { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel" }
        ],
        plugins: [
          new webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('production')
            }
          })
        ],
      }
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(destBase + '/js'));
})

gulp.task('default', ['build']);

gulp.task('build', ['sass', 'mapapp']);

gulp.task('watch', function() {
  gulp.watch(assetsBase + sassGlob, ['sass']);
})
