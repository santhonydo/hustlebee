hustleBeeAppModule.factory('informationFactory', function($q, $timeout, $location, $http){

  var factory = {};

  factory.post = function(data, url, callback){
    console.log('getting user')
    $http.post(url, data).success(function(output){
      console.log('got user')
      console.log(output)
      callback(output);
    })
  }

  factory.get = function(url, callback){
    $http.get(url).success(function(output){
      console.log(output)
      callback(output);
    })
  }


  return factory;
})

