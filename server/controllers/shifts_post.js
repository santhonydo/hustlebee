module.export = function(req, res){
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
}
