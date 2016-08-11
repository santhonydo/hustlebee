hustleBeeAppModule.factory('hustleBeeAppFactory', function($q, $timeout, $location, $http){
  var mainInfo = [];
  var factory = {};




 // factory.deleteAddress = function(data, callback){
 //   $http.post('/deleteAddress', data).success(function(data){
 //     callback(data);
 //   })
 // }

 // factory.updateUser = function(data, callback){
 //   $http.post('/updateUser', data).success(function(data){
 //     callback(data);
 //   })
 // }

 // factory.adminUpdateUser = function(data, callback){
 //   $http.post('/adminUpdateUser', data).success(function(output){
 //     callback(output);
 //   })
 // }

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

 // factory.getUpdatedUserData = function(data, callback){
 //   $http.post('/getUser', userId).success(function(data){
 //     callback(data);
 //   })
 // }

 // factory.getAllShifts = function(callback){
 //   $http.get('/getAllShifts').success(function(output){
 //     callback(output);
 //   })
 // }

  factory.uploadPicture = function(data, callback){
		var uploadUrl = "/multer";
		$http.post(uploadUrl,data, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		})
		.success(function(){
      callback('success');
		})
		.error(function(){
      callback('failed');
		});
    
  }

  return factory;
});
