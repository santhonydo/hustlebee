hustleBeeAppModule.controller('ResetPasswordController', function($scope, $state, $stateParams, authFactory, hustleBeeAppFactory){

  authFactory.reset($stateParams, function(success){
    if(success){
      $state.go('resetPassword');
    } else {
      $state.go('forgot');
    }
  })
})
