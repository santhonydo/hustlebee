hustleBeeAppModule.controller('InfoChangeModalController', function($scope, $rootScope, $uibModal, $uibModalInstance, $uibModalStack, changeInfo, $location, $state, $stateParams, informationFactory, hustleBeeAppFactory){

  $scope.error = false;
  $scope.disabled = true;
  $scope.info = changeInfo;
  $scope.userInfo = {};

  $scope.update = function(data){
    data._id = $scope.info._id;
    if(data === undefined){
      $uibModalInstance.dismiss('cancel');
    }
    if(data.email === undefined){
      data.email = changeInfo.email;
    }
    if(data.firstName === undefined){
      data.firstName = changeInfo.firstName;
    }
    if(data.lastName === undefined){
      data.lastName = changeInfo.lastName;
    }
    if(data.username === undefined){
      data.username = changeInfo.username;
    }
    if(data.zipcode === undefined){
      data.zipcode = changeInfo.zipcode;
    }
    if(data.licenseNumber === undefined){
      data.licenseNumber = changeInfo.licenseNumber;
    }
    if(data.licenseExpirationDate === undefined){
      data.licenseExpirationDate = changeInfo.licenseExpirationDate;
    }
    if(data.stateOfLicensure === undefined){
      data.stateOfLicensure = changeInfo.stateOfLicensure;
    }
    if(data.status === undefined){
      data.status = changeInfo.status;
    }
    if(data.phoneNumber === undefined){
      data.phoneNumber = changeInfo.phoneNumber;
    }
    informationFactory.post(data, '/adminUpdateUser', function(output){
      $rootScope.$broadcast('updatelist');
      $uibModalStack.dismissAll();
    });
  };

  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };

});
