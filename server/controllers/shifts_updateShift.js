var mongoose = require('mongoose');
var Shift = mongoose.model('Shift');
var sendgrid = require('sendgrid')('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');

module.exports = function(req,res){
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
