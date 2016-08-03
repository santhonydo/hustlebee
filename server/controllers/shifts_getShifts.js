module.exports = function(req,res){
  var employerId = req.body['_id'];
  Shift.find({employer: employerId}, function(err, shifts){
    if(err){
      console.log(err);
    }else{
      res.json(shifts);
    }
  })
}
