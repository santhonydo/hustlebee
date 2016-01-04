var emails = require('./../server/controllers/emails.js');

module.exports = function(app){

	app.post('/signUp', function (req, res){
		emails.signup(req, res);
	});

}