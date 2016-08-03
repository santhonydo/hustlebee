hustleBeeAppModule.controller('EmployerInfoPageController', function($scope, $location, $state, userFactory, hustleBeeAppFactory){


	$scope.login = function() {
		var auth = userFactory.getUserStatus();

		if (auth === true){
			$state.go('business.user');
		} else {
			$state.go('login');
		}
	}
})
