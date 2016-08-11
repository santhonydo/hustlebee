var mongoose = require('mongoose');
var Email = mongoose.model('Email');

module.export = function(req,res){
  var email = new Email(req.body);

  email.save(function(err, data){
    if(err){
      console.log('error adding email');
    }else{
      // sendgrid.send({
      // 	to : data.email,
      // 	bcc: ['anthony@medicyne.com', 'tracy@medicyne.com'],
      // 	from: 'service@medicyne.com',
      // 	subject: 'Welcome to Medicyne!',
      // 	text: 'Congratulations on choosing a better health care! Unfortunately, Medicyne is not servicing medication deliveries in your neighborhood just yet.  We’ll notify you as soon as we launch in your area.',
      // 	html: '<p>Hi ' + data.name + ',</p><h4 style="text-align: center"><strong>Congratulations on choosing a better health care!</strong></h4><h4>We’re getting there!</h4><p>Unfortunately, Medicyne is not servicing medication deliveries in your neighborhood just yet.  We’ll notify you as soon as we launch in your area.</p><h4>Meanwhile, get a sneak peak of our premium services.</h4><p>Text our pharmacist line at (213) 674-0633 to schedule a one-time FREE health review.</p><h4>Tell your family and friends!</h4><p>So they, too, will have access to expert health care at unbeatable convenience.</p><p>Thank you for your interest in Medicyne. Stay tuned!</p><p style="text-align: center"><a href="mailto:?subject=I wanted you to see this site&amp;body=Check out this site https://www.medicyne.com." title="Share by Email">Email</a><span> | </span><a href="https://www.facebook.com/sharer/sharer.php?u=www.medicyne.com" title="Share on Facebook">Facebook</a><span> | </span><a href="https://twitter.com/home?status=www.medicyne.com" title="Share on Twitter">Twitter</a></p>'
      // }, function(err, json){
      // 	if (err) {return console.error(err);}
      // });
      res.json(data);
    }
  })	
}
