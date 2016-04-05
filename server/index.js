#!/usr/bin/env babel-node
'use strict';

const ROOT = 'dist/';
const CFG = require('../config.json');
const HBS_EXT = '.hbs';

const express		= require('express');
const exphbs		= require('express-handlebars');
const fs			= require('fs');
const hbsHelpers	= require('./hbs-helpers');

const app = express();
app.listen(CFG.listen.port, CFG.listen.host);
app.set('views', ROOT);
app.disable('x-powered-by');
//app.set('trust proxy', true);
//app.enable('trust proxy');

app.engine('hbs', exphbs({
	layoutsDir: ROOT +'layouts/',
	partialsDir: ROOT +'partials/',
	helpers: hbsHelpers(app),
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

	fs.exists(ROOT + 'pages/' + page + HBS_EXT, exists=> {
		if(exists) res.render('pages/' + page, { title: capitalize(page) });
		else res.status(404).render('error', { error: `Couldn't find page "${page}"`, code: 404, title: "404" });
	});
});

/* Handle paths not routed.
 * This will activate on *all* unrouted requests, even non-GET requests (POST etc.)
 * This route must always be the last specified */
app.use( (req, res)=> res.status(404).render('error', { error: 'Page not found', code: 404 }) );

console.log(`Server listening on ${CFG.listen.host}:${CFG.listen.port}`);



/* A function used for capitalizing the first letter
 * in a string, used when setting the title of a page */
function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.substr(1);
}
