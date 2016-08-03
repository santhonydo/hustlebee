module.exports = function(req,res){
  var userInfo = req.body;
  User.update({_id: userInfo._id}, {$set: {phoneNumber: userInfo.phoneNumber}}, function(err){
    if(err){
      console.log('Error updating user info');
    } else {
      console.log('Successfuly updated user info');
      var success = {msg: 'Saved successfully!'};
      res.json(success)
    }
  })
}
