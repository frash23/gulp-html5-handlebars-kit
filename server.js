const ROOT = './dist/';

var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();
app.set('views', ROOT);

app.engine('hbs', exphbs({
	layoutsDir: ROOT +'layouts/',
	partialsDir: ROOT +'partials/',

	extname: 'hbs',
	defaultLayout: 'main.html'
}));
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
	res.render('index');
});

app.use('/static', express.static(ROOT +'static'));

app.listen(3000);
