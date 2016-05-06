var gulp     = require('gulp'),
    sass     = require('gulp-sass'),
    cleanCss = require('gulp-clean-css'),
    svgmin   = require('gulp-svgmin'),
    concat   = require('gulp-concat'),
    uglify   = require('gulp-uglify'),
    rename   = require('gulp-rename');

var assetsBase = 'website/assets',
    destBase = 'website/static'
    sassGlob = '/**/*.scss';


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

gulp.task('default', ['build']);

gulp.task('build', ['sass']);

gulp.task('watch', function() {
  gulp.watch(assetsBase + sassGlob, ['sass']);
})
