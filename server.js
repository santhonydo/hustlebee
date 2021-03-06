var express = require('express');
var path = require('path');
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var app = express();
var async = require('async');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});

//configure passport
var passport = require('passport');
var expresSession = require('express-session');
app.use(expresSession({secret: 'justworkit'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));
app.use(bodyParser.json({limit: '10mb'}));

app.use(cookieParser('hustlebeeapp'));
app.use(flash());

require('./config/mongoose.js');
require('./server/controllers/register.js');
require('./server/controllers/login.js');
require('./config/routes.js')(app, passport);
require('./server/controllers/api.js')(router);
app.use('/api', router);

var initPassport = require('./server/controllers/init.js');
initPassport(passport);

app.use(express.static(path.join(__dirname, './client')));

app.post('/uploadPicture', upload.array('photos, 12'), function(req,res,next){
  console.log('hi', req.files);
});

app.listen(8888, function(){
  console.log('Listening on port 8888');
});

