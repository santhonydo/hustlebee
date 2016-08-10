var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(req,res){
  var userInfo = req.body;
  User.update({_id: userInfo._id}, {$set: {companyName: userInfo.companyName, firstName: userInfo.firstName, lastName: userInfo.lastName, email: userInfo.email, phoneNumber: userInfo.phoneNumber}}, function(err){
    if(err){
    } else {
      var success = {msg: 'Saved successfully!'};
      res.json(success)
    }
  })
}
