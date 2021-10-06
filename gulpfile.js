const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del=require('del');
const stripCssComments = require('gulp-strip-css-comments');


const browsersync = () => {
   browserSync.init({
      server: {
         baseDir: './app/'
      },
      notify: false
   })
}

const cleanDist= () => {
   return del('./dist')
}

const images = () => {
   return src('./app/images/**/*')
      .pipe(imagemin(
         [
	imagemin.gifsicle({interlaced: true}),
	imagemin.mozjpeg({quality: 75, progressive: true}),
	imagemin.optipng({optimizationLevel: 5}),
	imagemin.svgo({
		plugins: [
			{removeViewBox: true},
			{cleanupIDs: false}
		]
	})
]
      ))
      .pipe(dest('./dist/images'))
}

const scripts = () => {
   return src([
      './app/js/main.js'
   ])
      .pipe(concat('main.min.js'))
      .pipe(uglify())
      .pipe(dest('./app/js'))
      .pipe(browserSync.stream());
}

const styles = () => {
   return src('./app/scss/style.scss')
      .pipe(scss({outputStyle: 'expanded'})
         .on('error', scss.logError))
      .pipe(concat('style.min.css'))
      .pipe(stripCssComments())
      .pipe(autoprefixer({
         overrideBrowserslist: ['last 10 versions'],
         grid: true
      }))
      .pipe(dest('./app/css/'))
      .pipe(browserSync.stream());
};

const build = () => {
   return src([
      './app/css/style.min.css',
      './app/fonts/**/*',
      './app/js/main.min.js',
      './app/*.html'
   ], {base: 'app'})
      .pipe(dest('dist'));
}

const watching = () => {
   watch(['./app/scss/**/*.scss'], styles);
   watch(['./app/js/**/*.js', '!./app/js/main.min.js'], scripts);
   watch(['./app/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;

exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, scripts, browsersync, watching);