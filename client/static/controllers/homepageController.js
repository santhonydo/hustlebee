hustleBeeAppModule.controller('HomepageController', function($scope, $location, $anchorScroll, $uibModal, $state, $stateParams, hustleBeeAppFactory){

  if($location.$$search.param == 'register'){
    $location.hash('fh5co-cta');
    $anchorScroll();
  }


  $scope.login = function(){
    $location.path('employee/login')
  }

	$scope.businessPage = function() {
		var auth = hustleBeeAppFactory.getUserStatus();

		if (auth === true){
			$state.go('business.user');
		} else {
			$state.go('employerInfoPage');
		}
	}
});
