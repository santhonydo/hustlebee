hustleBeeAppModule.controller('ResetPasswordController', function($scope, $state, $stateParams, authFactory, userFactory, hustleBeeAppFactory){

  authFactory.reset($stateParams, function(success){
    if(success){
      userFactory.setParams($stateParams);
      $state.go('resetPassword');
    } else {
      $state.go('forgot');
    }
  })
})
