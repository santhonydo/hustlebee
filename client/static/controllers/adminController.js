hustleBeeAppModule.controller('AdminController', function($scope, $rootScope, $uibModal, $location, $state, $stateParams, hustleBeeAppFactory){

  var auth = hustleBeeAppFactory;

  $rootScope.loggedIn = false;

  if (auth.getUserStatus() === true) {
    $rootScope.loggedIn = true
  }

  $scope.login = function() {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'sm',
      templateUrl: '/static/partials/login_modal.html',
      controller: 'AuthController'
    })
  }

  $scope.register = function() {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'md',
      templateUrl: '/static/partials/register_modal.html',
      controller: 'AuthController'
    })
  }

  $scope.logout = function(){		
    hustleBeeAppFactory.logout(function(success){
      if(success){
        $state.go('business.home');
      }
    })
  }

})

hustleBeeAppModule.controller('AdminLoginController', function($scope, $uibModal, $rootScope, $state, $stateParams, hustleBeeAppFactory){
  var auth = hustleBeeAppFactory

  if (auth.getUserStatus() === true) {
    $rootScope.loggedIn = true;
  } else {
    $rootScope.loggedIn = false;
  }


})

hustleBeeAppModule.controller('AdminMainController', function($scope, $uibModal, $rootScope, $state, $stateParams, hustleBeeAppFactory){
  var auth = hustleBeeAppFactory
  var getInfo = function(){
    hustleBeeAppFactory.getInfo(function(data){
      if(data){
        $scope.mainInfo = data;
      }
    })
  };

  getInfo();

  if (auth.getUserStatus() === true) {
    $rootScope.loggedIn = true;
  } else {
    $rootScope.loggedIn = false;
  }


  $scope.clear = function(){
    getInfo();
  }


  $scope.employeeFilter = function(){
    $scope.mainInfo = [];
    hustleBeeAppFactory.useInfo(function(data){
      for(x in data){
        if(data[x].employer == false){
          $scope.mainInfo.push(data[x]);
        }
      }
    })
  }

  $scope.employerFilter = function(){
    $scope.mainInfo = [];
    hustleBeeAppFactory.useInfo(function(data){
      for(x in data){
        if(data[x].employer == true){
          $scope.mainInfo.push(data[x]);
        }
      }
    })
  }

  $scope.verified = function(){
    $scope.mainInfo = [];
    hustleBeeAppFactory.useInfo(function(data){
      for(x in data){
        if(data[x].status == 1){
          $scope.mainInfo.push(data[x]);
        }
      }
    })
  }

  $scope.$on("updatelist", function(){
    hustleBeeAppFactory.getInfo(function(data){
      if(data){
        $scope.mainInfo = data;
      }
    })
  })




  $scope.moreInfo = function(theinfo) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      templateUrl: '/static/partials/userInfoModal.html',
      controller: 'InfoModalController',
      resolve: {
        info: function(){
          return theinfo;
        }
      }
    })
  }
})



