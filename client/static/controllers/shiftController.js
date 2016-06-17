hustleBeeAppModule.controller('ShiftsController', function($scope, $rootScope, $uibModal, $location, $state, $stateParams, hustleBeeAppFactory){

});

hustleBeeAppModule.controller('ShiftsMainController', function($scope, $rootScope, $uibModal, $location, $state, $stateParams, hustleBeeAppFactory){

  hustleBeeAppFactory.getAllShifts(function(output){
    $scope.shifts = output;
  });

  $scope.register = function(){
    $location.path('/employee').search({param: 'register'});
  }
});
