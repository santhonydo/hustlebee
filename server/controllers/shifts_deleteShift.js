var mongoose = require('mongoose');
var Shift = mongoose.model('Shift');

module.exports = function(req,res){
  var shiftId = req.body.id;
  Shift.findOne({_id: shiftId}, function(err, shift){
    if(err){
      console.log("Error finding shift");
    } else {
      if (shift.accepted == 0) {
        Shift.remove({_id: shiftId}, function(err, removed){
          if (err) {
            console.log('error removing shift from db');
          } else {
            var success = {removed: "removed"};
            res.json(success);
          }
        })
      } else {
        var error = {error: "cannot delete"};
        res.json(error);
      }
    }
  })
}
