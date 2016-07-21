var mongoose = require('mongoose');
var sendgrid = require('sendgrid')('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');

var Shift = mongoose.model('Shift');

module.exports = function () {
  return {
    postShift: function(req, res){
      var shiftData = req.body.shift;
      var shiftAddressDic = shiftData["shiftAddress"];
      var shiftAddressSt = "";
      var shiftAddressCt = shiftAddressDic.city + ", " + shiftAddressDic.state + " " + shiftAddressDic.zipcode;
      if(shiftAddressDic.suite == undefined) {
        shiftAddressSt = shiftAddressDic.street;
      } else {
        shiftAddressSt = shiftAddressDic.street + " Suite " + shiftAddressDic.suite;
      }

      var userData = req.body.userInfo;
      var shift = new Shift(shiftData);
      shift.save(function(err, data){
        if (err){
          console.log('error saving shift to database');
        } else {
          console.log('successfully added a shift');
          sendgrid.send({
            to : ['anthony@hustlebee.com', 'tracy@hustlebee.com'],
            from: 'support@hustlebee.com',
            subject: 'New Shift!',
            html: '<h1>New Shift Added!</h1><p>Shift Date: ' + shiftData.date + '</p><p>Start Time (24H): ' + shiftData.startTime + '</p><p>Shift Duration: ' + shiftData.duration + '</p><p>Shift Position: ' + shiftData.position + '</p><p>Shift Address: ' + shiftAddressSt + " " + shiftAddressCt + '</p><p>Shift Employer Name: ' + userData.firstName + ' ' + userData.lastName + ' </p><p>Company: ' + userData.companyName + ' </p><p>Email: ' + userData.email + '</p>'
          }, function(err, json){
            if (err){
              return console.log(err);
            }
            console.log(json);
          });

          res.json(data);
        }
      })
    },

    getAllShifts: function(req, res){
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
    },

    getAvailableShifts: function(req, res){
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
    },


    getShifts: function(req, res){
      var employerId = req.body['_id'];

      Shift.find({employer: employerId}, function(err, shifts){
        if(err){
          console.log(err);
        }else{
          res.json(shifts);
        }
      })

    },

    deleteShift: function(req, res){
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


    },
    updateShift: function(req, res){
      var shiftId = req.body.shiftId;
      var userId = req.body.userId;
      Shift.update({_id: shiftId}, {accepted: 1, employee: userId}, function(err, shift){
        if(err){
          console.log(err)
        }
        else{
          sendgrid.send({
            to : req.body.employerEmail,
            bcc: ['anthony@hustlebee.com', 'tracy@hustlebee.com'], 
            from: 'support@hustlebee.com',
            subject: 'Shift accepted',
            html: '<p>Hi ' + req.body.employerFirstName + ', </p><p>Your shift for ' + req.body.shiftDate + ', has been accepted.</p><p>Our customer representative will contact you shortly to confirm the shift before releasing employee contact information. If you have any urgent matters, please do not hesistate to email us at support@hustlebee.com.</p><p>Best regards,</p><p>The Hustlebee Team</p>.'
          }, function(err, json){
            if (err){
              return console.log(err);
            }
            console.log(json);
          }); 
          res.json('works');
        }
      })
    }
  }	
}()
