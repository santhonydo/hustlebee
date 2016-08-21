var stripe = require("stripe")("sk_live_DW1I6W9YtmtT2mPNRAWHiwBJ");
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(req, res){
  stripe.customers.create({
    source: req.param('token'),
    email: req.param('email')
  }, function(err, customer){
    User.update({email: req.body.email}, {$set: {card: customer.id}}, function(err){
      if(err){
        console.log(err);
        console.log('Error updating user info');
      } else {
        console.log('Successfuly updated user info');
        var success = {msg: 'Saved successfully!'};
        res.json(success)
      }
    })
  })
}
