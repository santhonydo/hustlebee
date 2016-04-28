hustleBeeAppModule.controller('InfoModalController', function($scope, $rootScope, $uibModal, $uibModalInstance, info, $location, $state, $stateParams, hustleBeeAppFactory){

  $scope.error = false;
  $scope.disabled = true;
  console.log(info);
  $scope.info = info;

  $scope.changeInfo = function(data){
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'sm',
      templateUrl: '/static/partials/infoChangeModal.html',
      controller: 'InfoChangeModalController',
      resolve: {
        changeInfo: function(){
          return data;
        }
      }
    })
  }

  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  }

})

hustleBeeAppModule.controller('InfoChangeModalController', function($scope, $rootScope, $uibModal, $uibModalInstance, $uibModalStack, changeInfo, $location, $state, $stateParams, hustleBeeAppFactory){

  $scope.error = false;
  $scope.disabled = true;
  $scope.info = changeInfo;
  $scope.userInfo = {};

  $scope.update = function(data){
    console.log($scope.info._id)
    data._id = $scope.info._id;
    console.log(data);
    if(data == undefined){
      $uibModalInstance.dismiss('cancel')
    }
    if(data.email == undefined){
      data.email = changeInfo.email
    }
    if(data.firstName == undefined){
      data.firstName = changeInfo.firstName
    }
    if(data.lastName == undefined){
      data.lastName = changeInfo.lastName
    }
    if(data.username == undefined){
      data.username = changeInfo.username
    }
    if(data.zip == undefined){
      data.zipcode = changeInfo.zipcode
    }
    if(data.licenseNumber == undefined){
      data.licenseNumber = changeInfo.licenseNumber
    }
    if(data.licenseExpirationDate == undefined){
      data.licenseExpirationDate = changeInfo.licenseExpirationDate
    }
    if(data.stateOfLicense == undefined){
      data.stateOfLicense = changeInfo.stateOfLicense
    }
    if(data.status == undefined){
      data.status = changeInfo.status
    }
    if(data.phoneNumber == undefined){
      data.phoneNumber = changeInfo.phoneNumber
    }
    hustleBeeAppFactory.adminUpdateUser(data, function(output){
      $rootScope.$broadcast('updatelist');
      $uibModalStack.dismissAll()
    })
  }

  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  }

})


