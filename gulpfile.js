// Define options & paths
// ----------------------

var gp = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'imagemin-*'],
	replaceString: /^gulp-|^imagemin-/,
	camelize: true,
	lazy: true
});

const IMAGEMIN_OPTS = {
	optimizationLevel: 6,
	interlaced: true,
	multipass: true,
	use:[
		gp.mozjpeg({quality: 65, dcScanOpt: 2, smooth: 15})
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
	module: {
		loaders: [ { loader: 'babel-loader' } ],
		cache: true
	}
};

const DIST_PATH = './dist/';
const SRC_PATH = './src/';
const SRC = {
	'IMG': SRC_PATH +'images',
	'HTML': SRC_PATH +'html',
	'CSS': SRC_PATH +'css',
	'JS': SRC_PATH +'js'
};
const DIST = {
	'IMG': DIST_PATH +'images',
	'HTML': DIST_PATH,
	'CSS_PATH': DIST_PATH,
	'CSS_NAME': 'style.css',
	'ES5_PATH': DIST_PATH,
	'ES5_NAME': 'scripts.js'
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
	return gulp.src(SRC.HTML +'/**')
		.pipe( gp.cached('html') )
		.pipe( gp.htmlmin(HTMLMIN_OPTS) )
		.pipe( gulp.dest(DIST.HTML) );
});

/* Optimize images */
gulp.task('images', function() {
	return gulp.src(SRC.IMG +'/**')
		.pipe( gp.cached('images') )
		.pipe( gp.imagemin(IMAGEMIN_OPTS) )
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
	return gulp.src(SRC.JS +'/main.js')
		.pipe( gp.webpack(WEBPACK_OPTS) )
		.pipe( gp.rename(DIST.ES5_NAME) )
		.pipe( gulp.dest(DIST.ES5_PATH) );
});

/* Remove everything in dist/ */
gulp.task('clean', function() {
	rimraf.sync(DIST_PATH);
	mkdir(DIST_PATH);
});

/* Default task. Does not optimize images due to the large overhead it
 * comes with, run `images` manually or use watch/dist */
gulp.task('default', ['html', 'css', 'javascript']);

gulp.task('watch', function() {
	gulp.watch(SRC.HTML +'/**', ['html']);
	gulp.watch(SRC.CSS +'/**', ['css']);
	gulp.watch(SRC.JS +'/**', ['javascript']);
	gulp.watch(SRC.IMG +'/**', ['images']);
});

/* Clean dist/, optimize images & run default task */
gulp.task('dist', ['clean', 'images', 'default']);
