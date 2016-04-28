hustleBeeAppModule.controller('DashboardController', function($scope, $rootScope, $uibModal, $location, $state, $stateParams, hustleBeeAppFactory){

	var auth = hustleBeeAppFactory;

	if (auth.getUserStatus() === true) {
		$rootScope.loggedIn = true;
	}

	//LogIn Auth
	$scope.error = false;
	$scope.disabled = true;

	$scope.logout = function(){	
		$rootScope.loggedIn = false;	
		hustleBeeAppFactory.logout(function(success){
			if(success){
				$state.go('login');
			}
		})
	}
});