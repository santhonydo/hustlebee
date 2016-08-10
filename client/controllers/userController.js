hustleBeeAppModule.controller('UserController', function($scope, $rootScope, $state, $stateParams, authFactory){
  $scope.logout = function(){	
    $rootScope.loggedIn = false;	
    authFactory.logout(function(success){
      if(success){
        $state.go('userLogin');
      }
    })
  }
});
