"use strict";

/* Import modules */
var fs = require('fs');
var rimraf = require('rimraf');
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');

/* Function for creating a folder */
var mkdir = function(path) {
	try { fs.mkdirSync(path); }
	catch(e) { if(e.code !== 'EEXIST') throw e; }
};

/* Load gulp plugins dynamically and automatically */
var gp = gulpLoadPlugins({
	pattern: ['gulp-*', 'imagemin-*', 'webpack-*'],
	replaceString: /^gulp-|^imagemin-|-stream$/,
	camelize: true,
	lazy: true
});

/* Constant values */
const WATCH_IGNORE = ['!**/~*', '!**/.*̈́', '!**/*.swp'];
const IMAGEMIN_SLOW = true ; // Set this to false to speed up image compression at the cost of quality

/* Paths for getting source and putting built code */
const DIST_PATH = 'dist/';
const SRC_PATH = 'src/';
const STATIC_PATH = DIST_PATH +'/static/';

/* Locations of various source assets */
const SRC = {
	'IMG': SRC_PATH +'/images',
	'HTML': SRC_PATH +'/html',
	'CSS': SRC_PATH +'/css',
	'JS': SRC_PATH +'/js',
	'STATIC': SRC_PATH +'/static'
};

/* Locations of built assets */
const DIST = {
	'IMG': STATIC_PATH +'/images',
	'HTML': DIST_PATH,
	'CSS_PATH': STATIC_PATH,
	'CSS_NAME': '/style.css',
	'JS_PATH': STATIC_PATH,
	'JS_NAME': 'scripts.js',
	'STATIC_PATH': STATIC_PATH,
};

/* Image compression options */
const IMAGEMIN_OPTS = {
	optimizationLevel: IMAGEMIN_SLOW? 6 : 2,
	interlaced: true,
	multipass: true,
	use:[
		gp.mozjpeg({ quality: 75, dcScanOpt: 2, smooth: 15 }),
		gp.pngquant({ quality: 50-65, speed: IMAGEMIN_SLOW? 1 : 9 })
	]
};

/* HTML minifcation options */
const HTMLMIN_OPTS = {
	collapseWhitespace: true,
	removeComments: true,
	minifyJS: true,
	minifyCSS: true,
	minifyURLs: true
};

/* Webpack options */
const WEBPACK_OPTS = {
	target:'web',
	output: {
		filename: '[name].js',
		pathinfo: true,
		comments: false
	},
	module: {
		loaders: [ {
			loader: 'babel-loader',
			query: {
				cacheDirectory: true,
				presets: ['es2015', 'stage-3'],
				plugins: ['transform-runtime']
			}
		} ],
		cache: true
	}
};

/* Javascript minification options */
const UGLIFY_OPTS = {
	preserveComments: 'license'
};

/* Gulp tasks */

/* Minify HTML */
gulp.task('html', function() {
	return gulp.src([SRC.HTML +'/**', '!'+ SRC.HTML +'/**/*.inc*'])
		.pipe( gp.cached('html') )
		.pipe( gp.htmlmin(HTMLMIN_OPTS) )
		.pipe( gulp.dest(DIST.HTML) );
});

/* Optimize images */
gulp.task('images', function() {
	return gulp.src(SRC.IMG +'/**')
		.pipe( gp.cached('images', { optimizeMemory: true }) )
		.pipe( gp.imagemin(IMAGEMIN_OPTS) )
		.pipe( gulp.dest(DIST.IMG) );
});

/* Bundle, vendor prefix & optimize CSS */
gulp.task('css', function() {
	gulp.src(SRC.CSS +'/main.scss')
		.pipe( gp.sass() )
		.on( 'error', e=> console.log('Unable to process CSS: ', e.name, e.message) )
		.pipe( gp.myth() )
		.pipe( gp.csso() )
		.pipe( gp.rename(DIST.CSS_NAME) )
		.pipe( gulp.dest(DIST.CSS_PATH) );
});

/* Bundle src/js and transpile it to ES5 */
gulp.task('javascript', function() {
	return gulp.src(SRC.JS +'/Main.js')
		.pipe( gp.webpack(WEBPACK_OPTS) )
		.pipe( gp.rename({ basename: DIST.JS_NAME, extname: '' }) )
		.pipe( gulp.dest(DIST.JS_PATH) )
		.pipe( gp.uglify(UGLIFY_OPTS) )
		//.pipe( gp.rename({ extname: '.min.js' }) )
		//.pipe( gulp.dest(DIST.JS_PATH) );
});

/* Copy over static files */
gulp.task('static', function() {
	return gulp.src(SRC.STATIC +'/**')
		.pipe( gp.cached('static', { optimizeMemory: true }) )
		.pipe( gulp.dest(DIST.STATIC_PATH) )
});

/* Remove everything in dist/ */
gulp.task('clean', function() {
	rimraf.sync(DIST_PATH);
	mkdir(DIST_PATH);
});

gulp.task('watch', function() {
	gulp.watch([SRC.HTML +'/**', ...WATCH_IGNORE], ['html']);
	gulp.watch([SRC.CSS +'/**', ...WATCH_IGNORE], ['css']);
	gulp.watch([SRC.JS +'/**', ...WATCH_IGNORE], ['javascript']);
	gulp.watch([SRC.IMG +'/**', ...WATCH_IGNORE], ['images']);
	gulp.watch([SRC.STATIC +'/**', ...WATCH_IGNORE], ['static']);
});

/* Clean dist/, optimize images & run default task */
gulp.task('dist', ['clean', 'images', 'static', 'html', 'css', 'javascript']);

/* Default task is building everything, then watching */
gulp.task('default', ['dist', 'watch']);
