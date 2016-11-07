/* eslint-disable import/no-extraneous-dependencies */

import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import browserSync from 'browser-sync';
import webpack from 'webpack-stream';
import del from 'del';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import cleanCss from 'gulp-clean-css';
import concat from 'gulp-concat';
import svgmin from 'gulp-svgmin';

import webpackConfig from './webpack.config.babel';

const sync = browserSync.create();
const assetsBase = 'website/assets';
const distBase = 'website/static';

const paths = {
  allSass: `${assetsBase}/sass/**/*.scss`,
  cssDist: `${distBase}/css`,
  svgDist: `${distBase}/img`,
  gulpFile: 'gulpfile.babel.js',
  allSrcJs: `${assetsBase}/apps/**/*.js`,
  jsLibDir: `${assetsBase}/apps/lib`,
  jsDist: `${distBase}/js`,
  clientEntryPoints: [
    `${assetsBase}/js/apps/megamap/app.js`,
    `${assetsBase}/js/apps/projectmap/app.js`,
  ],
};

gulp.task('sass:build', () =>
  gulp.src(paths.allSass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCss({ processImportFrom: ['local'] }))
    .pipe(concat('site.min.css'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.cssDist)),
);

gulp.task('svg', () =>
  gulp.src(`${assetsBase}/svg/**/*.svg`)
    .pipe(svgmin({
      plugins: [{
        removeTitle: true,
      }, {
        removeRasterImages: true,
      }, {
        cleanupNumericValues: {
          floatPrecision: 2,
        },
      }],
    }))
    .pipe(gulp.dest(paths.svgDist)),
);

gulp.task('js:lint', () =>
  gulp.src([
    paths.allSrcJs,
    paths.gulpFile,
  ])
    .pipe(eslint())
    .pipe(eslint.format()),
    // .pipe(eslint.failAfterError()),
);

gulp.task('js:clean', () =>
  del([
    paths.jsLibDir,
  ]),
);

gulp.task('js:build', ['js:lint', 'js:clean'], () =>
  gulp.src(paths.allSrcJs)
    .pipe(babel())
    .pipe(gulp.dest(paths.jsLibDir)),
);

gulp.task('js:package', ['js:build'], () =>
  gulp.src(paths.clientEntryPoints)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.jsDist)),
);


// gulp.task('default', ['sass:watch', 'megamap:watch', 'projectmap:watch']);

// gulp.task('build', ['sass:build', 'megamap:build', 'projectmap:build']);

gulp.task('sass:watch', () => {
  gulp.watch(paths.allSass, ['sass:build']);
  sync.init({
    proxy: 'localhost:8000',
    serveStatic: [distBase],
    files: [`${paths.cssDist}/*.css`],
    ghostMode: false,
    open: false,
  });
});
