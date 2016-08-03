hustleBeeAppModule.factory('userFactory', function($q, $timeout, $location, $http){
  var user = null;
  var userInfo = null;
  var tempInfo = {};
  var factory = {};
  var adminStatus = false;

  factory.checkStatus = function(){
    if(adminStatus == false){
      $location.path('/admin');
    }
  }

  factory.setStatus = function(data){
    adminStatus = data;
  }

  factory.setUser = function(data, data2){
    user = data;
    userInfo = data2;
  }

  factory.getUserStatus = function() {
    return user;
  }

  factory.getUserData = function() {
    return userInfo;
  }

  factory.setTempInfo = function(newUser, license){
    tempInfo.newUser = newUser;
    tempInfo.license = license;
  }

  factory.getTempInfo = function(callback){
    callback(tempInfo);
  }

  return factory;
})
