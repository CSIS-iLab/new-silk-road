/* eslint-disable import/no-extraneous-dependencies, no-console */

import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import browserSync from 'browser-sync';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import del from 'del';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import cleanCss from 'gulp-clean-css';
import concat from 'gulp-concat';
import svgmin from 'gulp-svgmin';
import process from 'process';

import webpackConfig from './webpack.config.babel';

const sync = browserSync.create();
const assetsBase = 'website/assets';
const distBase = 'website/static';

const paths = {
  allSass: `${assetsBase}/sass/**/*.scss`,
  cssDist: `${distBase}/css`,
  svgDist: `${distBase}/img`,
  gulpFile: 'gulpfile.babel.js',
  allSrcJs: `${assetsBase}/apps/**/*.js?(x)`,
  jsLibDir: `${assetsBase}/lib`,
  jsDist: `${distBase}/js`,
  clientEntryPoints: [
    `${assetsBase}/js/apps/megamap/app.jsx`,
    `${assetsBase}/js/apps/projectmap/app.jsx`,
  ],
};

const makeBundler = (type = 'default') => {
  const config = Object.create(webpackConfig);
  if (process.env.NODE_ENV === 'production') {
    if ({}.hasOwnProperty.call(config, 'plugins') === false) {
      config.plugins = [];
    }
    config.plugins = config.plugins.concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
    ]);
  } else {
    config.debug = true;
  }
  const bundler = type === 'streaming' ? webpackStream(config) : webpack(config);
  return bundler;
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

gulp.task('js:watch', () => {
  gulp.watch(paths.allSrcJs, ['js:package']);
});

gulp.task('js:package', ['js:build'], () =>
  gulp.src(paths.clientEntryPoints)
    .pipe(makeBundler('streaming'))
    .pipe(gulp.dest(paths.jsDist)),
);

gulp.task('default', ['js:watch', 'js:package']);

gulp.task('watch', () => {
  const bundler = makeBundler();
  gulp.watch(paths.allSass, ['sass:build']);
  sync.init({
    proxy: 'localhost:8000',
    serveStatic: [distBase],
    files: [`${paths.cssDist}/*.css`],
    ghostMode: false,
    open: false,
    middleware: [
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
        stats: { colors: true },
      }),
    ],
  });
});

gulp.task('js:stuff', () =>
  gulp.src(paths.clientEntryPoints)
    .pipe(makeBundler('streaming'))
    .pipe(gulp.dest(paths.jsDist)),
);
