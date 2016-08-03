hustleBeeAppModule.controller('AdminLoginController', function($scope, $location, authFactory, userFactory, $uibModal, $rootScope, $state, $stateParams, hustleBeeAppFactory){

  if (userFactory.getUserStatus() === true) {
    $rootScope.loggedIn = true;
  } else {
    $rootScope.loggedIn = false;
  }

  $scope.adminLogin = function(data){
    authFactory.adminLogin(data, function(output){
      userFactory.setStatus(output);
      $location.path('/admin/main');
    });
  };
});
