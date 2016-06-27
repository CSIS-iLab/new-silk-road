'use strict';

const gulp        = require('gulp');
const gutil       = require('gulp-util');
const gulpif      = require('gulp-if');
const source      = require('vinyl-source-stream');
const buffer      = require('vinyl-buffer');
const babelify    = require('babelify');
const watchify    = require('watchify');
const sourcemaps  = require('gulp-sourcemaps');
const browserify  = require('browserify');
const uglify      = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');
const cleanCss    = require('gulp-clean-css');
const svgmin      = require('gulp-svgmin');
const concat      = require('gulp-concat');
const rename      = require('gulp-rename');

const assetsBase = './website/assets',
    destBase   = './website/static',
    sassGlob   = '/**/*.scss';

const production = process.env.NODE_ENV === 'production';

function buildScript(entryFile, appName, watch=false) {
  let args = { entries: [entryFile], cache: {}, packageCache: {}, debug: !production};
  let bundler = watch ? watchify(browserify(args)) : browserify(args);
  bundler.transform(babelify.configure({sourceMapRelative: 'apps/map',}));
  function rebundle() {
    let bindle = bundler.bundle();

    return bindle.on('error', function (err) {
        gutil.log(err.message);
        browserSync.notify("Browserify Error!");
        this.emit("end");
    })
    .pipe(source(`${appName}.js`))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(gulpif(production, uglify()))
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(destBase + '/js'))
    .pipe(gulpif(watch, browserSync.stream({once: true})));
  }
  bundler.on('update', function () {
    rebundle();
    gutil.log('Rebundle...');
  });
  return rebundle();
}

const megamapAppName = 'megamap';
const megamapEntry = `${assetsBase}/apps/megamap/app.js`
gulp.task('megamap:build', function () {
    return buildScript(megamapEntry, megamapAppName);
});
gulp.task('megamap:watch', function () {
    return buildScript(megamapEntry, megamapAppName, true);
});

const projectmapAppName = 'projectmap';
const projectmapEntry = `${assetsBase}/apps/projectmap/app.js`
gulp.task('projectmap:build', function () {
    return buildScript(projectmapEntry, projectmapAppName);
});
gulp.task('projectmap:watch', function () {
    return buildScript(projectmapEntry, projectmapAppName, true);
});

gulp.task('js:watch', ['megamap:watch', 'projectmap:watch']);

gulp.task('sass:build', function () {
    var cssDest = destBase + '/css';
    return gulp.src(assetsBase + sassGlob)
               .pipe(sourcemaps.init())
               .pipe(sass().on('error', sass.logError))
               .pipe(cleanCss({processImportFrom: ['local']}))
               .pipe(concat('site.min.css'))
               .pipe(sourcemaps.write('./maps'))
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


gulp.task('default', ['js:watch'], function () {
    gulp.watch(assetsBase + sassGlob, ['sass:build']);
    browserSync.init({
        proxy: "localhost:8000",
        serveStatic: [destBase],
        files: [destBase + '/css/*.css'],
        open: false
    });
});

gulp.task('build', ['sass:build', 'megamap:build', 'projectmap:build']);

gulp.task('sass:watch', function() {
    gulp.watch(assetsBase + sassGlob, ['sass:build']);
})
