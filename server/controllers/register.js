var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');
var sendgrid = require('sendgrid')('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');
var stripe = require("stripe")("sk_test_Wf8ZUqakNp9NOqETeWuE5AFU");

module.exports = function(passport) {

	passport.use('register', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({ 'email' :  req.param('email') }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in register: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('Email already exists');
                        return done(null, false, req.flash('message','Email Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials

                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.param('email');
                        newUser.firstName = req.param('firstName');
                        newUser.lastName = req.param('lastName');
                        newUser.zipcode = req.param('zipcode') || null;
                        newUser.phoneNumber = req.param('phoneNumber');
                        newUser.employer = req.param('employer');
                        newUser.occupation = req.param('occupation') || null;
                        newUser.stateOfLicensure = req.param('stateLicense') || null;
                        newUser.licenseNumber = req.param('licenseNumber') || null;
                        newUser.licenseExpirationDate = req.param('licenseExpirationDate') || null;
                        newUser.status = 0;

                        // save the user
                        newUser.save(function(err, result) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            }
                            if (result) {
                                console.log('User Registration succesful');
                                sendgrid.send({
                                    to : req.param('email'),
                                    bcc: ['anthony@hustlebee.com', 'tracy@hustlebee.com'],
                                    from: 'anthony@hustlebee.com',
                                    subject: 'Welcome Hustlebee Partner!',
                                    html: '<p>Hi ' + req.param('firstName') + ',</p><p> My name is Dr. Anthony Do, PharmD, one of Hustlebee co-founders. I would like to personally welcome you to Hustlebee.</p><p>Our customer representative will contact you shortly to orient you on our platform and to answer any questions you may have. If you have any additional questions or comments, you can contact us at support@hustlebee.com or email me directly at anthony@hustlebee.com.</p><p>My team and I are thrilled to be part of your healthcare team.</p><p>Best regards,</p><p>Anthony & The HustleBee Team</p>'
                                }, function(err, json){
                                    if (err){
                                        return console.log(err);
                                    }
                                    console.log(json);
                                }); 
                                //add card to stripe api herequake
                                stripe.customers.create({
                                  description: newUser._id,
                                  source: 'fufu'
                                })
                                

                                return done(null, newUser);
                            }
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );


    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
}
