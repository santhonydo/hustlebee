hustleBeeAppModule.controller('DashboardController', function($scope, $rootScope, $uibModal, $location, $state, $stateParams, userFactory, authFactory, hustleBeeAppFactory){

	var auth = userFactory;

	if (auth.getUserStatus() === true) {
		$rootScope.loggedIn = true;
	}

	//LogIn Auth
	$scope.error = false;
	$scope.disabled = true;

	$scope.logout = function(){	
		$rootScope.loggedIn = false;	
		authFactory.logout(function(success){
			if(success){
				$state.go('login');
			}
		})
	}
});
