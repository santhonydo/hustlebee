var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(req,res){
  var userInfo = req.body;
  if(userInfo.zipcode === undefined){
    User.update({_id: userInfo._id}, {$set: {firstName: userInfo.firstName, lastName: userInfo.lastName, email: userInfo.email, phoneNumber: userInfo.phoneNumber, status: userInfo.status, username: userInfo.username}}, function(err){
      if(err){
        console.log(err);
        console.log('Error updating user info');
      } else {
        console.log('Successfuly updated user info');
        var success = {msg: 'Saved successfully!'};
        res.json(success)
      }
    })
  }
  else{
    User.update({_id: userInfo._id}, {$set: {firstName: userInfo.firstName, lastName: userInfo.lastName, email: userInfo.email, phoneNumber: userInfo.phoneNumber, zipcode: userInfo.zipcode, licenseNumber: userInfo.licenseNumber, licenseExpirationDate: userInfo.licenseExpirationDate, stateOfLicensure: userInfo.stateOfLicensure, status: userInfo.status, username: userInfo.username}}, function(err){
      if(err){
        console.log('Error updating user info');
      } else {
        console.log('Successfuly updated user info');
        var success = {msg: 'Saved successfully!'};
        res.json(success)
      }
    })
  }
}
