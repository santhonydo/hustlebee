hustleBeeAppModule.factory('regChecker', function($q, $timeout, $location, $http){
  factory = {};
  factory.userCheck = function(newUser, stateLicense, callback){
    if(!newUser.firstName){
      callback({status: false, message: 'First name not defined'}) 
    }
    else if(!newUser.lastName){
      callback({status: false, message: 'Last name not defined'})
    }
    else if(!newUser.companyName){
      callback({status: false, message: 'Company not defined'})
    }
    else if(!newUser.phone){
      callback({status: false, message: 'Phone Number not defined'})
    }
    else if(!newUser.email){
      callback({status: false, message: 'Email not defined'})
    }
    else if(!newUser.licenseNumber){
      callback({status: false, message: 'License number not defined'})
    }
    else if(!stateLicense){
      callback({status: false, message: 'State License not selected'})
    }
    else if(!newUser.licenseExpirationDate){
      callback({status: false, message: 'Expiration date not defined'})
    }
    else if(!newUser.password){
      callback({status: false, message: 'Password not defined'})
    }
    else if(!newUser.confirmPassword){
      callback({status: false, message: 'Password Confirmation not defined'})
    }
    else if(newUser.password !== newUser.confirmPassword){
      callback({status: false, message: 'Passwords don\'t match'})
    }
    else{
      callback({status: true});
    }
  }
  return factory;
})
