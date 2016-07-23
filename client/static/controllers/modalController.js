hustleBeeAppModule.controller('ModalController', function($scope, $rootScope, $state, $uibModalInstance, userFactory, informationFactory, hustleBeeAppFactory, uiGmapGoogleMapApi){

  $scope.error = false;
  $scope.success = false;

  var userInfo = userFactory.getUserData();

  $scope.states = [{value: "CA", label: "CA"}];

  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
    $rootScope.$broadcast('updateUser');
  };

  $scope.addAddress = function(address, state){
    if(angular.isUndefined(address)) {
      $scope.error = true;
      $scope.errorMessage = "All fields are required.";
    } else if(angular.isUndefined(address.street) || angular.isUndefined(address.street) || angular.isUndefined(address.city) || angular.isUndefined(address.zipcode) || angular.isUndefined(state)){

      $scope.error = true;
      $scope.success = false;
      $scope.errorMessage = "All fields are required.";
    } else {
      //address should be renamed
      var address = address;
      address.state = state.value;
      address.userId = userInfo._id;

      var geoCodeAddress = address.street + " " + address.city + " " + address.state + " " + address.zipcode;

      hustleBeeAppFactory.geoCode(geoCodeAddress, function(data){
        if (data.status == "OK") {
          $scope.error = false;
          $scope.errorMessage = "";
          address.coordinate = data.coordinate;

          informationFactory.post(address, '/addAddress', function(data){
            if(data){
              $scope.success = true;
              $scope.successMessage = "Address added successfully! Add another?";
              $rootScope.$broadcast('updateUser');
              $scope.address = {};
              $scope.state = {};
            }
          });
        } else {
          $scope.error = true;
          $scope.errorMessage = "Invalid address.";
          return;
        }
      });
    } 
  };
});
