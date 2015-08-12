// Define options & paths
// ----------------------

var gp = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'imagemin-*'],
	replaceString: /^gulp-|^imagemin-/,
	camelize: true,
	lazy: true
});

var IMAGEMIN_SLOW = true;

const IMAGEMIN_FAST_OPTS = {
	optimizationLevel: 2,
	interlaced: true,
	multipass: true,
	use:[
		gp.mozjpeg({quality: 70, dcScanOpt: 2, smooth: 15}),
		gp.pngquant({quality: 45-60, speed: 9})
	]
};
const IMAGEMIN_SLOW_OPTS = {
	optimizationLevel: 6,
	interlaced: true,
	multipass: true,
	use:[
		gp.mozjpeg({quality: 70, dcScanOpt: 2, smooth: 15}),
		gp.pngquant({quality: 45-60, speed: 1})
	]
};

const HTMLMIN_OPTS = {
	collapseWhitespace: true,
	removeComments: true,
	minifyJS: true,
	minifyCSS: true,
	minifyURLs: true
};

const WEBPACK_OPTS = {
	target:'web',
	output: { filename: '[name].js' },
	module: {
		loaders: [ { loader: 'babel-loader?compact=false' } ],
		cache: true
	}
};

const UGLIFY_OPTS = {
	preserveComments: 'some'
};

const DIST_PATH = 'dist/';
const SRC_PATH = 'src/';
const STATIC_PATH = DIST_PATH +'/static/';
const SRC = {
	'IMG': SRC_PATH +'/images',
	'HTML': SRC_PATH +'/html',
	'CSS': SRC_PATH +'/css',
	'JS': SRC_PATH +'/js',
	'STATIC': SRC_PATH +'/static'
};
const DIST = {
	'IMG': STATIC_PATH +'/images',
	'HTML': DIST_PATH,
	'CSS_PATH': STATIC_PATH,
	'CSS_NAME': '/style.css',
	'JS_PATH': STATIC_PATH +'/js',
	'STATIC_PATH': STATIC_PATH
};

// Load dependencies & plugins
// ---------------------------
var fs = require('fs');
var rimraf = require('rimraf');
var gulp = require('gulp');
/* We're using this shorthand to avoid unnecessarily adding a
 * dependency such as gulp-clean */
var mkdir = function(path) {
	try { fs.mkdirSync(path); }
	catch(e) { if(e.code !== 'EEXIST') throw e; }
};


// Define gulp tasks
// -----------------
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
		.pipe( gp.cached('images', {optimizeMemory: true}) )
		.pipe( gp.imagemin( IMAGEMIN_SLOW? IMAGEMIN_SLOW_OPTS : IMAGEMIN_FAST_OPTS ) )
		.pipe( gulp.dest(DIST.IMG) );
});

/* Bundle, vendor prefix & optimize CSS */
gulp.task('css', function() {
	return gulp.src(SRC.CSS +'/main.scss')
		.pipe( gp.cached('css') )
		.pipe( gp.sass() )
		.pipe( gp.myth() )
		.pipe( gp.csso() )
		.pipe( gp.rename(DIST.CSS_NAME) )
		.pipe( gulp.dest(DIST.CSS_PATH) );
});

/* Bundle src/js and transpile it to ES5 */
gulp.task('javascript', function() {
	return gulp.src(SRC.JS +'/*.js')
		.pipe( gp.webpack(WEBPACK_OPTS) )
		.pipe( gulp.dest(DIST.JS_PATH) )
		.pipe( gp.uglify(UGLIFY_OPTS) )
		.pipe( gp.rename({extname: '.min.js'}) )
		.pipe( gulp.dest(DIST.JS_PATH) );
});

/* Copy over static files */
gulp.task('static', function() {
	return gulp.src(SRC.STATIC +'/**')
		.pipe( gp.cached('static', {optimizeMemory: true}) )
		.pipe( gulp.dest(DIST.STATIC_PATH) )
});

/* Remove everything in dist/ */
gulp.task('clean', function() {
	rimraf.sync(DIST_PATH);
	mkdir(DIST_PATH);
});

/* Make imagemin spend extra time compressing to get better quality */
gulp.task('slowimgs', function() {
	IMAGEMIN_SLOW = true;
});

/* Default task. Does not optimize images due to the large overhead it
 * comes with, run `images` manually or use watch/dist */
gulp.task('default', ['html', 'css', 'javascript']);

gulp.task('watch', function() {
	gulp.watch(SRC.HTML +'/**', ['html']);
	gulp.watch(SRC.CSS +'/**', ['css']);
	gulp.watch(SRC.JS +'/**', ['javascript']);
	gulp.watch(SRC.IMG +'/**', ['images']);
	gulp.watch(SRC.STATIC +'/**', ['static']);
});

/* Clean dist/, optimize images & run default task */
gulp.task('dist', ['slowimgs', 'clean', 'images', 'static', 'default']);
