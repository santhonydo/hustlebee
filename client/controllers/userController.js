hustleBeeAppModule.controller('UserController', function($scope, $rootScope, $uibModal, $location, $state, $stateParams, informationFactory, userFactory, authFactory, hustleBeeAppFactory){
  $scope.logout = function(){	
    $rootScope.loggedIn = false;	
    authFactory.logout(function(success){
      if(success){
        $state.go('userLogin');
      }
    })
  }
});
