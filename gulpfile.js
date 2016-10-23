'use strict';

const fs          = require('fs');
const path        = require('path');
const rimraf      = require('rimraf');
const gulp        = require('gulp');
const gutil       = require('gulp-util');
const loadPlugins = require('gulp-load-plugins');

const gp = loadPlugins({
	pattern      : ['gulp-*', 'imagemin-*', 'webpack-*'],
	replaceString: /^gulp-|^imagemin-|-stream$/,
	camelize     : true,
	lazy         : true
});

/* Returns true if environment variable `NODE_DEV` is set.
 * Image compression speed is increased at the cost of quality */
const DEV = process.env.hasOwnProperty('NODE_DEV');

const DIST_PATH   = 'dist/';
const SRC_PATH    = 'src/';
const STATIC_PATH = DIST_PATH +'/static/';

const WATCH_PATHS = [ 
	/* We don't want the watch event to fire
	 * on temporary files created by editors */
	'!' + SRC_PATH + '/**/*~',
	'!' + SRC_PATH + '/**/~*',
	'!' + SRC_PATH + '/**/.*̈́'
];

const SRC = {
	'IMG'   : SRC_PATH + '/images',
	'HTML'  : SRC_PATH + '/html',
	'CSS'   : SRC_PATH + '/css',
	'JS'    : SRC_PATH + '/js',
	'STATIC': SRC_PATH + '/static'
};

const DIST = {
	'IMG'        : STATIC_PATH +'/images',
	'HTML'       : DIST_PATH,
	'CSS_PATH'   : STATIC_PATH,
	'CSS_NAME'   : '/style.css',
	'JS_PATH'    : STATIC_PATH,
	'JS_NAME'    : 'scripts.js',
	'STATIC_PATH': STATIC_PATH,
};

const IMAGEMIN_PLUGINS = [
	gp.mozjpeg( { quality: 75, dcScanOpt: 2, smooth: 15 }),
	gp.pngquant({ quality: 50-65, speed: DEV? 10 : 1 }),
	gp.gifsicle({ interlaced: true, optimizationLevel: DEV? 1 : 3 }),
	gp.svgo()
];

/* HTML minifcation options */
const HTMLMIN_OPTS = {
	collapseWhitespace: true,
	removeComments: true,
	minifyJS: true,
	minifyCSS: true,
	minifyURLs: true,
	quoteCharacter: '"'
};

const BABEL_OPTS = {
	cacheDirectory: true,
	presets: ['es2015'],
	plugins: [ [ 'transform-runtime', { polyfill: false } ] ]
}

const WEBPACK_OPTS = {
	target:'web',
	output: {
		filename: '[name].js',
		pathinfo: true,
		comments: false
	},
	module: {
		loaders: [ {
			loader: 'babel',
			include: [ path.resolve(__dirname, SRC.JS) ],
			query: BABEL_OPTS
		} ],
		cache: true
	},
	resolve: { root: [ path.resolve(__dirname, SRC.JS) ] }
};

const UGLIFY_OPTS = {
};

/* Gracefully (sort of) create a folder */
function mkdir(path) {
	try { fs.mkdirSync(path); }
	catch(e) { if(e.code !== 'EEXIST') throw e; }
}

gulp.task('html', function() {
	return gulp.src([SRC.HTML +'/**', '!'+ SRC.HTML +'/**/*.inc*'])
		.pipe( gp.cached('html') )
		.pipe( gp.htmlmin(HTMLMIN_OPTS) )
		.pipe( gulp.dest(DIST.HTML) );
});

gulp.task('images', function() {
	return gulp.src(SRC.IMG +'/**')
		.pipe( gp.cached('images', { optimizeMemory: true }) )
		.pipe( gp.imagemin(IMAGEMIN_PLUGINS) )
		.pipe( gulp.dest(DIST.IMG) );
});

gulp.task('css', function() {
	gulp.src(SRC.CSS +'/main.scss')
		.pipe( gp.sass() ).on('error', gp.sass.logError)
		.pipe( gp.myth() )
		.pipe( gp.csso() )
		.pipe( gp.rename(DIST.CSS_NAME) )
		.pipe( gulp.dest(DIST.CSS_PATH) );
});

gulp.task('javascript', function() {
	gulp.src(SRC.JS +'/Main.js')
		.pipe( gp.webpack(WEBPACK_OPTS) ).on( 'error', e=> this.emit('end') )
		.pipe( gp.rename({ basename: DIST.JS_NAME, extname: '' }) )
		.pipe( gulp.dest(DIST.JS_PATH) )
		.pipe( gp.uglify(UGLIFY_OPTS) )
		.pipe( gp.rename({ extname: '.min.js' }) )
		.pipe( gulp.dest(DIST.JS_PATH) );
});

gulp.task('static', function() {
	return gulp.src(SRC.STATIC +'/**')
		.pipe( gp.cached('static', { optimizeMemory: true }) )
		.pipe( gulp.dest(DIST.STATIC_PATH) );
});

gulp.task('clean', function() {
	rimraf.sync(DIST_PATH);
	mkdir(DIST_PATH);
});

gulp.task('watch', function() {
	gulp.watch( WATCH_PATHS.concat(SRC.JS + '/**'), ['javascript'] );
	gulp.watch( WATCH_PATHS.concat(SRC.CSS + '/**'), ['css'] );
	gulp.watch( WATCH_PATHS.concat(SRC.IMG + '/**'), ['images'] );
	gulp.watch( WATCH_PATHS.concat(SRC.HTML + '/**'), ['html'] );
	gulp.watch( WATCH_PATHS.concat(SRC.STATIC + '/**'), ['static'] );
});

/* Clean dist/, optimize images & run default task */
gulp.task('dist', ['clean', 'images', 'static', 'html', 'css', 'javascript']);

/* Default task is building everything, then watching */
gulp.task('default', ['dist', 'watch']);
