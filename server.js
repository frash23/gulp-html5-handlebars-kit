const ROOT = './dist/';

var express = require('express');
var exphbs  = require('express-handlebars');

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

app.get('/*', function (req, res) {
	var path = req.path.substring(1);
	var file = path || 'index';

	var data = {
		thing: req.path
	}

	res.render(file, data, function(err, html) {
		var code = 200;

		if(/*hasPerms*/false) err = new Error('Unauthorized');

		if(err) {
			var msg = err.message;
			if(msg.match(/Failed to lookup view/)) code = 404;
			else if(msg.match(/EACCES, open/)) code = 403;
			else if(msg.match(/Unauthorized/)) code = 401;
			else code = 500;

			res.render('error', {error: msg, code: code});
			return;
		}

		res.send(html);
	});
});

app.listen(3000);
