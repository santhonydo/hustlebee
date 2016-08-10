var mongoose = require('mongoose');
var User = mongoose.model('User');
var sendgrid = require('sendgrid')('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');

module.exprots = function(req,res){
  User.findOne({'email' : req.body.email}, function(err, user){
    if(err) {
      res.json({regError: "Error registering user"})
    }
    if(user){
      res.json({userExist: "User already exists!"})
    } else {
      var newUser = new User();
      var userInfo = req.body
      newUser.firstName = userInfo.firstName;
      newUser.lastName = userInfo.lastName;
      newUser.email = userInfo.email;
      newUser.phoneNumber = userInfo.phone;
      newUser.occupation = userInfo.occupation;
      newUser.stateOfLicensure = userInfo.stateLicense;
      newUser.licenseNumber = userInfo.licenseNumber;
      newUser.licenseExpirationDate = userInfo.licenseExpirationDate;
      newUser.password = createHash("hustlebee2016");
      newUser.status = 0;
      newUser.employer = false;
      newUser.save(function(err, user) {
        if(err) {
          console.log("Error in saving user: " + err);
        } else {
          sendgrid.send({
            to : userInfo.email,
            bcc: ['anthony@hustlebee.com', 'tracy@hustlebee.com'], 
            from: 'anthony@hustlebee.com',
            subject: 'Welcome to Hustlebee!',
            html: '<p>Hi ' + userInfo.firstName + ' ' + userInfo.lastName + ', </p><p>My name is Dr. Anthony Do, PharmD, one of Hustlebee co-founders. I would like to personally welcome you to Hustlebee.</p><p>Our customer representative will contact you shortly to orient you on our platform and collect some information to verify your license. If you have any additional questions or comments, you can contact us at support@hustlebee.com or email me directly at anthony@hustlebee.com.</p><p>My team and I are thrilled to have you as part of our healthcare team. </p><p>Best regards,</p><p>Anthony & The Hustlebee Team</p>'
          }, function(err, json){
            if (err){
              return console.log(err);
            }
            console.log(json);
          }); 
          res.json(user);
        }
      })
    }
  })
}
