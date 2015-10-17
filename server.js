const ROOT = 'dist/';
const HBS_EXT = '.hbs';

var express = require('express');
var exphbs  = require('express-handlebars');
var fs		= require('fs');

var app = express();
app.listen(3000);
app.set('views', ROOT);

app.engine('hbs', exphbs({
	layoutsDir: ROOT +'layouts/',
	partialsDir: ROOT +'partials/',
	extname: 'hbs',
	defaultLayout: 'main.hbs'
}));
app.set('view engine', 'hbs');



/* You should probably be proxying this server through nginx,
 * which you might as well serve static content from. */
app.use('/static', express.static(ROOT +'static'));

/* Route for index/home/default path */
app.get(['/', '/home', 'index'], (req, res)=> res.render('index'));

/* Handle all paths under `page/`, dynamically load whatever comes after the slash */
app.get('/page/:page', function(req, res) {
	var page = req.params.page || 'index';

	fs.exists(ROOT + page + HBS_EXT, exists=> {
		if(exists) res.render(page);
		else res.status(404).render('error', {error: `Couldn't find page "${page}"`, code: 404});
	});
});

/* Handle paths not routed.
 * This will activate on *all* unrouted requests, even non-GET requests (POST etc.)
 * This route must always be the last specified */
app.use((req, res)=> res.status(404).render('error', {error: 'Page not found', code: 404}));
