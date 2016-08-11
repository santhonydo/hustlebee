var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(req,res){
  User.find({}).populate('addresses').exec(function(err, results){
    if(err){
      console.log(err);
    }
    else{
      res.json(results);
    }
  })
}
