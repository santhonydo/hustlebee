var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(req,res){
  console.log('in tokens');
  User.findOne({resetPasswordToken: req.body.id}).populate('addresses').exec(function(err, user){
    if(err){
      console.log('Error finding user');
    } else {
      res.json(user);
      console.log(user);
    }
  })
}

