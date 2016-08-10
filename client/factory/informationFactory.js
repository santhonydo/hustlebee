hustleBeeAppModule.factory('informationFactory', function($q, $timeout, $location, $http){

  var factory = {};

  factory.post = function(data, url, callback){
    $http.post(url, data).success(function(output){
      callback(output);
    })
  }

  factory.get = function(url, callback){
    $http.get(url).success(function(output){
      callback(output);
    })
  }

  return factory;
})

