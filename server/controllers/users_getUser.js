module.exports = function(req,res){
  User.findOne({_id: req.body.id}).populate('addresses').exec(function(err, user){
    if(err){
      console.log('Error finding user');
    } else {
      console.log(user);
      res.json(user);
    }
  })
}
