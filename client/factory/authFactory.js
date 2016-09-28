hustleBeeAppModule.factory('authFactory', function($q, $timeout, $location, regChecker, $http){
  var factory = {};

  factory.isLoggedIn = function() {
    if(user) {
      return true;
    } else {
      return false;
    }
  };

  factory.adminLogin = function(data, callback){
    $http.post('/adminLogin', data).success(function(output){
      if(output === true){
        callback(output);
      }
    });
  };

  factory.login = function(data, callback){
    var deferred = $q.defer();

    $http.post('/login', data).success(function(data){
      if (data.username) {
        deferred.resolve();
        callback(data, true);
      } else {
        deferred.reject();
        callback(data, false)
      }
    }).error(function(error){
      user = false;
      deferred.reject();
    });

    return deferred.promise;
  };


  factory.register = function(data, callback){
    data.username = data.email
    var deferred = $q.defer();

    $http.post('/register', data).success(function(data){
      if (data.username){
        deferred.resolve();
        callback(data, true)
      } else {
        deferred.reject();
        callback(data, false)
      }
    }).error(function(error){
      deferred.reject();
    });

    return deferred.promise;
  };

    factory.logout = function(callback){
    var deferred = $q.defer()

    $http.get('/logout').success(function(data){
      user = false;
      deferred.resolve();
      callback(data);
    }).error(function(error){
      user = false;
      deferred.reject();
    });

    return deferred.promise;
  };

  factory.forgot = function(data, callback){
    $http.post('/forgot', data).success(function(data){
      userInfo = data;
      callback(data);
    })
  };

  factory.reset = function(data, callback) {
    $http.post('/reset', data).success(function(data){
      if(data === null) {
        var userError = "Expired token";
        userInfo = userError;
      } else {
        userInfo = data;
      }

      callback(data);
    })
  }

  factory.newPassword = function(data, callback){
    $http.post('/newPassword', data).success(function(data){
      if(data.message === 'Error reseting'){
        var userError = "Expired token";
        userInfo = userError;
      }
      callback(data);
    })
  };

  factory.hustlebeeSignup = function(data, callback){
    $http.post('/hustlebeeSignup', data).success(function(data){
      callback(data);
    })
  };


  return factory;
})
