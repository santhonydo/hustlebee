hustleBeeAppModule.controller('UserSettingsController', function($scope, $http, $rootScope, $uibModal, $location, $state, $stateParams, informationFactory, userFactory, authFactory, hustleBeeAppFactory){
  var userInfo = userFactory.getUserData();
  var auth = userFactory.getUserStatus();

  if (auth === true) {
    $rootScope.loggedIn = true;
  }
  else{
    $state.go('userLogin')
  }
  $scope.success = false;

  if (userInfo.status == 1) {
    $scope.employerStatus = "Verified";
    $scope.unverified = false;
    $scope.verified = true;
  } else {
    $scope.employerStatus = "Unverified License";
    $scope.unverified = true;
    $scope.verified = false;
  }

  if(auth === true){
    $rootScope.loggedIn = true;
  }
  else{
    $state.go('userLogin')
  }

  $scope.uploadFile = function(){
    var file = $scope.myFile;
    var fd = new FormData();
    fd.append('file', file);
    fd.append('userId', userInfo._id);

    hustleBeeAppFactory.uploadPicture(fd, function(output){
      if(output === 'success'){
        $scope.success = true;
      }
    })
  };

  var getUserInfo = function(){
    $scope.user = userInfo;
    if(userInfo.addresses[0]){
      $scope.user.address= [userInfo.addresses[0]];
    }
    else{
      $scope.user.address = 'Please add an Address';
    }
  }

  getUserInfo();

  var getUpdatedUserData = function() {
    userFactory.getUpdatedUserData(userInfo._id, function(data){
      userInfo = data;
      getUserInfo();
    })
  }

  $scope.$on('updateUser', function(){
    getUpdatedUserData();
  })

  $scope.updateUser = function(user){
    if(angular.isUndefined(user.phoneNumber)){
      return
    } else {
      informationFactory.post(user, '/employeeUpdateUser', function(data){
        if(data){
          getUpdatedUserData();
          $scope.success = true;
          $scope.successMessage = data.msg;
        }
      })
    }
  }

});

