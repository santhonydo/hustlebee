var express = require('express');
var path = require('path');

var app = express();
app.set('view engine', 'html');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

require('./config/mongoose.js');
require('./config/routes.js')(app);

app.use(express.static(path.join(__dirname, './client')));

app.listen(8888, function(){
	console.log('Listening on port 8888');
})