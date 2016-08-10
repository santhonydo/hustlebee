var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(req,res){
  User.findOne({resetPasswordToken: req.body.id}, function(err, user){
    if(err){
      console.log(err);
    } else {
      res.json(user);
    }
  })
}
