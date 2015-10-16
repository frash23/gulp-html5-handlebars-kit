const ROOT = 'dist/';
const HBS_EXT = '.hbs';

var express = require('express');
var exphbs  = require('express-handlebars');
var fs		= require('fs');

var app = express();
app.set('views', ROOT);

app.engine('hbs', exphbs({
	layoutsDir: ROOT +'layouts/',
	partialsDir: ROOT +'partials/',
	extname: 'hbs',
	defaultLayout: 'main.hbs'
}));
app.set('view engine', 'hbs');



app.use('/static', express.static(ROOT +'static'));

app.get('/', function(req, res) { res.render('index'); });

app.get('/:page', function (req, res) {
	var file = req.params.page || 'index';
	fs.exists(ROOT + file + HBS_EXT, function(exists, err) {
		if(exists) res.render(file, {}, (err, html)=> res.send(err? err : html));
		else res.render('error', {error: 'Unable to find '+file, code: 404}, (err, html)=> res.send(err? err : html));
	});

	var data = {
		thing: file
	}

		/*if(/*hasPerms*//*false) err = new Error('Unauthorized');

		if(err) {
			var msg = err.message;
			if( msg.match(/Failed to lookup view/) || msg.match(/Cannot find/) ) code = 404;
			else if( msg.match(/EACCES, open/) ) code = 403;
			else if( msg.match(/Unauthorized/) ) code = 401;
			else code = 500;

			res.render('error', {error: msg, code: code});
			return;
		}

		res.send(html);
	});*/
});

app.listen(3000);
