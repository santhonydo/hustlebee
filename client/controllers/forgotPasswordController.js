hustleBeeAppModule.controller('ForgotPasswordController', function($scope, $uibModal, $rootScope, $state, $stateParams, userFactory, authFactory, hustleBeeAppFactory){

  var userData = userFactory.getUserData()
  $scope.error = false;
  $scope.success = false;
  $scope.info = false;


  if(userData === 'Expired token'){
    $scope.info = true;
    $scope.infoMessage = 'Password reset token is invalid or has expired.'
  }

  $scope.emailReset = function(user){
    $scope.info = false;

    if (user === false){
      $scope.error = true;
      $scope.errorMessage = "Email is required."
      return
    }

    authFactory.forgot(user, function(success){
      if(success.msg === 'No account with that email address exists.'){
        $scope.user = {};
        $scope.error = true;
        $scope.success = false;
        $scope.errorMessage = success.msg;
      } else {
        $scope.user = {};
        $scope.error = false;
        $scope.success = true;
        $scope.successMessage = success.msg;
      }
    })
  }

  $scope.backToLogin = function() {
    $state.go('login');
  }
})

