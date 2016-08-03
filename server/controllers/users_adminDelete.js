module.exports = function(req,res){
  User.remove({_id: req.body._id}, function(err,user){
    console.log('user deleted')
    res.json(true)
  });
}
