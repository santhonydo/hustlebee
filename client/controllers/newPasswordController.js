hustleBeeAppModule.controller('NewPasswordController', function($scope, $state, $stateParams, userFactory, authFactory, informationFactory, hustleBeeAppFactory){

  var userData;
  informationFactory.post({id: userFactory.getParams().id}, '/getToken', function(output){
    userFactory.setUser(false, output);
    userData = userFactory.getUserData();
    console.log('hi', userData);
  })
  $scope.error = false;
  $scope.success = false;
  $scope.info = false;

  $scope.backToLogin = function() {
    $state.go('login');
  }

  $scope.passwordReset = function(user){
    if(angular.isUndefined(user.password) || angular.isUndefined(user.passwordAgain) || (user.password === '') || (user.passwordAgain === '')) {
      $scope.error = true;
      $scope.errorMessage = "All fields are required.";
    } else {
      $scope.error = false;
      $scope.errorMessage = "";
      if (user.password != user.passwordAgain){
        $scope.error = true;
        $scope.errorMessage = "Passwords do not match. Try again!";
        $scope.user = {};
      } else {
        $scope.error = false;
        $scope.errorMessage = "";
        var userReset = {};
        userReset.token = userData.resetPasswordToken;
        userReset.password = user.password;
        console.log(userReset);
        authFactory.newPassword(userReset, function(success){
          if(success.message === 'Error reseting') {
            $state.go('business.forgot');
          } 
          if(success.message === 'success'){
            $scope.user = {};
            $scope.success = true;
            $scope.successMessage = "Your password has been successfully changed.";
          }
        })
      }
    }
  }
});
