module.exports = function(req,res){
  var shifts = {
    unaccepted: [],
    accepted: []
  };
  Shift.find({employer: {$exists: true}}).populate('employer').exec(function(err, output){
    if(err){
      console.log(err);
    }else{
      for(var x in output){
        if(output[x].accepted === 0){
          var object = {};
          object.position = output[x].position;
          object.wage = output[x].wage;
          object.employer = output[x].employer.companyName;
          object.date = output[x].date;
          object.startTime = output[x].startTime;
          object.duration = output[x].duration;
          object.address = output[x].shiftAddress.street;
          object.zipcode = output[x].shiftAddress.zipcode;
          object.city = output[x].shiftAddress.city;
          object.state = output[x].shiftAddress.state;
          object.shiftId = output[x]._id;
          object.employerEmail = output[x].employer.email;
          object.employerFirstName = output[x].employer.firstName
          shifts.unaccepted.push(object);
        }
        else if(output[x].employee == req.body.userId){
          var object = {};
          object.position = output[x].position;
          object.wage = output[x].wage;
          object.employer = output[x].employer.companyName;
          object.date = output[x].date;
          object.startTime = output[x].startTime;
          object.duration = output[x].duration;
          object.address = output[x].shiftAddress.street;
          object.zipcode = output[x].shiftAddress.zipcode;
          object.city = output[x].shiftAddress.city;
          object.state = output[x].shiftAddress.state;
          object.shiftId = output[x]._id;
          shifts.accepted.push(object);
        }
      }
      res.json(shifts);
    }
  })
}
