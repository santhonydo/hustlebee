hustleBeeAppModule.factory('hustleBeeAppFactory', function($q, $timeout, $location, $http){
  var user = null;
  var userInfo = null;
  var mainInfo = [];;
  var factory = {};
  var adminStatus = false;

  factory.checkStatus = function(){
    if(adminStatus == false){
      $location.path('/admin');
    }
  }
  factory.isLoggedIn = function() {
    if(user) {
      return true;
    } else {
      return false;
    }
  }

  factory.getUserStatus = function() {
    return user;
  }

  factory.getUserData = function() {
    return userInfo;
  }

  factory.hustlebeeSignup = function(data, callback){
    $http.post('/hustlebeeSignup', data).success(function(data){
      callback(data);
    })
  };

  factory.login = function(data, callback){
    var deferred = $q.defer();

    $http.post('/login', data).success(function(data){
      if (data.username) {
        user = true;
        userInfo = data;
        deferred.resolve();
        callback(data);
      } else {
        user = false;
        deferred.reject();
        callback(data)
      }
    }).error(function(error){
      user = false;
      deferred.reject();
    });

    return deferred.promise;
  };

  factory.register = function(data, callback){
    var deferred = $q.defer();

    $http.post('/register', data).success(function(data){
      if (data.username){
        user = true;
        userInfo = data;
        deferred.resolve();
        callback(data)
      } else {
        user = false;
        deferred.reject();
        callback(data)
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

  factory.postShift = function(data, callback){
    $http.post('/postShift', data).success(function(data){
      callback(data);
    })
  };

  factory.getShifts = function(data, callback){
    $http.post('/getShifts', data).success(function(data){
      callback(data);
    })
  };

  factory.deleteShift = function(data, callback){
    $http.post('/deleteShift', data).success(function(data){
      callback(data);
    })
  };

  factory.addAddress = function(data, callback){
    $http.post('/addAddress', data).success(function(data){
      callback(data);
    })
  };

  factory.deleteAddress = function(data, callback){
    $http.post('/deleteAddress', data).success(function(data){
      callback(data);
    })
  }

  factory.getUpdatedUserData = function(data, callback){
    var userId = {id: data};
    $http.post('/getUser', userId).success(function(data){
      userInfo = data;
      callback(data);
    })
  }

  factory.updateUser = function(data, callback){
    $http.post('/updateUser', data).success(function(data){
      callback(data);
    })
  }

  factory.adminUpdateUser = function(data, callback){
    $http.post('/adminUpdateUser', data).success(function(data){
      callback(data);
    })
  }

  factory.geoCode = function(data, callback){

    var address = data.replace(/ /g, '+');

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        var coordinate = {latitude: latitude, longitude: longitude};
        callback({status: "OK", coordinate: coordinate});
      } else {
        callback({error: 'Geocode error'});
      }
    })
  }

  factory.getInfo = function(callback){
    $http.get('/getInfo').success(function(data){
      mainInfo = data;
      callback(mainInfo);
    });
  }

  factory.useInfo = function(callback){
    callback(mainInfo)
  }

  factory.adminLogin = function(data){
    $http.post('/adminLogin', data).success(function(data){
      if(data == true){
        adminStatus = true;
        $location.path('/admin/main');
      }
    })
  }

  factory.getPictures = function(data, callback){
    var sendData = {_id : data}
    $http.post('/getPictures', sendData).success(function(output){
      callback(output);
    })
  }

  factory.adminDelete = function(data, callback){
    $http.post('/adminDelete', data).success(function(output){
      callback(output);
    })
  }

  factory.checkPictureUpdates = function(callback){
    $http.get('/checkPictureUpdates').success(function(output){
      callback(output);
    })
  }

  return factory;
});
