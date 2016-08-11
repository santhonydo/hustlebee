hustleBeeAppModule.controller('InfoModalController', function($scope, $rootScope, $uibModal, $uibModalInstance, info, $location, $state, $stateParams, informationFactory, hustleBeeAppFactory){

  $scope.error = false;
  $scope.disabled = true;
  $scope.info = info;
  $scope.info.url = "blank";


  informationFactory.post({_id : info._id}, 'getPictures', function(data){
    $scope.info.url =  data;
  });

  $scope.openPicture = function(){
    window.open(info.url, 'yourWindowName', 'width=200,height=150');
  }

  $scope.changeInfo = function(data){
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      templateUrl: '/partials/modals/infoChangeModal.html',
      controller: 'InfoChangeModalController',
      resolve: {
        changeInfo: function(){
          return data;
        }
      }
    });
  };

  $scope.deleteUser = function(deleteInfo) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'sm',
      templateUrl: '/partials/modals/deleteUserModal.html',
      controller: 'deleteModalController',
      resolve: {
        userDeleteInfo: function(){
          return deleteInfo;
        }
      }
    });
  };

  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };

});

