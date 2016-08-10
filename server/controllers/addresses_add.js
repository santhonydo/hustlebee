var mongoose = require('mongoose');
var Address = mongoose.model('Address');
var User = mongoose.model('User');

module.exports = function(req,res){
  var address = new Address(req.body);

  User.findOne({_id: req.body.userId}, function(err, user){
    if(err) {
      console.log("Error finding user")
    }
    if(user){
      user.addresses.push(address._id);
      user.save(function(err){
        if(err){
          console.log('Error adding address to user');
        } else {
          console.log('Address linked to user successfully!');
        }
      })
      address.save(function(err){
        if(err){
          console.log('Error saving address');
        } else {
          console.log('Address added to db successfully');
          var success = {msg: 'Address added'};
          res.json(success);
        }
      })
    }
  })
}
