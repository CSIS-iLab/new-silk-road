'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel';
import del from 'del';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import cleanCss from 'gulp-clean-css';
import concat from 'gulp-concat';
import svg from 'gulp-svgmin';

const sync = browserSync.create();
const assetsBase = 'website/assets';
const distBase = 'website/static';

const paths = {
  allSass: `${assetsBase}/sass/**/*.scss`,
  cssDist: `${distBase}/css`,
  svgDist: `${distBase}/img`,
  allSrcJs: `${assetsBase}/apps/**/*.js`,
  jsLibDir: `${assetsBase}/apps/lib`,
  jsDist: `${distBase}/js`,
  clientEntryPoints: [
    `${assetsBase}/js/apps/megamap/app.js`,
    `${assetsBase}/js/apps/projectmap/app.js`,
  ],
}

gulp.task('sass:build', () =>
    gulp.src(paths.allSass)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCss({processImportFrom: ['local']}))
        .pipe(concat('site.min.css'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.cssDist))
);

gulp.task('svg', () =>
  gulp.src(assetsBase + '/svg/**/*.svg')
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
      .pipe(gulp.dest(svgDist))
);

gulp.task('js:clean', () =>
  del([
    paths.jsLibDir,
  ])
);

gulp.task('js:build', ['js:clean'], () =>
  gulp.src(paths.allSrcJs)
    .pipe(babel())
    .pipe(gulp.dest(paths.jsLibDir))
);

gulp.task('js:package', ['js:build'], () =>
  gulp.src(paths.clientEntryPoints)
      .pipe(webpack(webpackConfig))
      .pipe(gulp.dest(paths.jsDist))
)


// gulp.task('default', ['sass:watch', 'megamap:watch', 'projectmap:watch']);

// gulp.task('build', ['sass:build', 'megamap:build', 'projectmap:build']);

gulp.task('sass:watch', function() {
    gulp.watch(paths.allSass, ['sass:build']);
    sync.init({
        proxy: "localhost:8000",
        serveStatic: [distBase],
        files: [`${cssDist}/*.css`],
        ghostMode: false,
        open: false
    });
})
