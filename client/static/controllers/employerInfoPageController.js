hustleBeeAppModule.controller('EmployerInfoPageController', function($scope, $location, $state, hustleBeeAppFactory){


	$scope.login = function() {
		var auth = hustleBeeAppFactory.getUserStatus();

		if (auth === true){
			$state.go('business.user');
		} else {
			$state.go('login');
		}
	}
})