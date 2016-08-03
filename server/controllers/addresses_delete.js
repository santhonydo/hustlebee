module.exports = function(req, res){
  Address.remove({_id: req.body.addressId}, function(err, data){
    if(err){
      console.log('Error removing adddress');
    } else {
      var success = {msg: 'Address deleted'};
      res.json(success);
    }
  })
}
