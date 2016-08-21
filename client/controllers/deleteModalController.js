hustleBeeAppModule.controller('deleteModalController', function($scope, $rootScope, $uibModal, $uibModalStack, $uibModalInstance, userDeleteInfo, $location, $state, $stateParams, informationFactory, hustleBeeAppFactory){

  $scope.error = false;
  $scope.disabled = true;
  $scope.info = userDeleteInfo;

  $scope.adminDelete = function(data){
    informationFactory.post(data, '/adminDelete', function(output){
      if(output === true){
        $rootScope.$broadcast('updatelist');
        $uibModalStack.dismissAll();
      }
    })
  }

  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };
});
