hustleBeeAppModule.controller('HomepageController', function($scope, $location, $anchorScroll, $uibModal, $state, $stateParams, userFactory, hustleBeeAppFactory){

  if($location.$$search.param == 'register'){
    $location.hash('fh5co-cta');
    $anchorScroll();
  }

  $scope.register = function() {
  	$location.path('employee/register')
  }

  $scope.login = function(){
    $location.path('employee/login')
  }

	$scope.businessPage = function() {
		var auth = userFactory.getUserStatus();

		if (auth === true){
			$state.go('business.user');
		} else {
			$state.go('employerInfoPage');
		}
	}
});
