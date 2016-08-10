hustleBeeAppModule.controller('AdminController', function($scope, authFactory, userFactory, $rootScope, $uibModal, $location, $state, $stateParams, hustleBeeAppFactory){

  $rootScope.loggedIn = false;

  if (userFactory.getUserStatus() === true) {
    $rootScope.loggedIn = true;
  }

  $scope.login = function() {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'sm',
      templateUrl: '/partials/modals/login_modal.html',
      controller: 'AuthController'
    });
  };

  $scope.register = function() {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      templateUrl: '/partials/modals/register_modal.html',
      controller: 'AuthController'
    });
  };

  $scope.logout = function(){		
    authFactory.logout(function(success){
      if(success){
        $state.go('business.home');
      }
    });
  };
});
