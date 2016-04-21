var gulp      = require('gulp'),
    sass      = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'),
    concat    = require('gulp-concat'),
    uglify    = require('gulp-uglify'),
    rename    = require('gulp-rename');

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
               .pipe(minifyCSS())
               .pipe(gulp.dest(cssDest))
});


gulp.task('default', ['build']);

gulp.task('build', ['sass']);

gulp.task('watch', function() {
  gulp.watch(assetsBase + sassGlob, ['sass']);
})
