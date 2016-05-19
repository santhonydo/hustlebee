hustleBeeAppModule.controller('InfoModalController', function($scope, $rootScope, $uibModal, $uibModalInstance, info, $location, $state, $stateParams, hustleBeeAppFactory){

  $scope.error = false;
  $scope.disabled = true;
  $scope.info = info;
  $scope.info.url = "blank";


  hustleBeeAppFactory.getPictures(info._id, function(data){
    $scope.info.url =  data;
  });

  $scope.openPicture = function(){
    window.open(info.url, 'yourWindowName', 'width=200,height=150');
  }

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
    });
  };

  $scope.deleteUser = function(deleteInfo) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'sm',
      templateUrl: '/static/partials/deleteUserModal.html',
      controller: 'deleteModalController',
      resolve: {
        userDeleteInfo: function(){
          return deleteInfo;
        }
      }
    });
  };

  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };

});

hustleBeeAppModule.controller('deleteModalController', function($scope, $rootScope, $uibModal, $uibModalStack, $uibModalInstance, userDeleteInfo, $location, $state, $stateParams, hustleBeeAppFactory){

  $scope.error = false;
  $scope.disabled = true;
  $scope.info = userDeleteInfo;

  $scope.adminDelete = function(data){
    hustleBeeAppFactory.adminDelete(data, function(output){
      if(output === true){
        $rootScope.$broadcast('updatelist');
        $uibModalStack.dismissAll();
      }
    })
  }

  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };

});

hustleBeeAppModule.controller('InfoChangeModalController', function($scope, $rootScope, $uibModal, $uibModalInstance, $uibModalStack, changeInfo, $location, $state, $stateParams, hustleBeeAppFactory){

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
    hustleBeeAppFactory.adminUpdateUser(data, function(output){
      $rootScope.$broadcast('updatelist');
      $uibModalStack.dismissAll();
    });
  };

  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };

});

hustleBeeAppModule.controller('ModalController', function($scope, $rootScope, $state, $uibModalInstance, hustleBeeAppFactory, uiGmapGoogleMapApi){

  $scope.error = false;
  $scope.success = false;

  var userInfo = hustleBeeAppFactory.getUserData();

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

          hustleBeeAppFactory.addAddress(address, function(data){
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



