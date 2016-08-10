var mongoose = require('mongoose');
var Shift = mongoose.model('Shift');

module.exports = function(req, res){
  var shifts = [];
  Shift.find({employer: {$exists: true}}).populate('employer').exec(function(err, output){
    if(err){
      console.log(err);
    }else{
      for(var x in output){
        var object = {};
        object.position = output[x].position;
        object.employer = output[x].employer.companyName;
        object.date = output[x].date;
        object.address = output[x].shiftAddress.street;
        object.zipcode = output[x].shiftAddress.zipcode;
        object.city = output[x].shiftAddress.city;
        object.state = output[x].shiftAddress.state;
        shifts.push(object);
      }
      res.json(shifts);
    }
  })
}
