hustleBeeAppModule.controller('UserHomePageController', function($scope, $rootScope, $state, $stateParams, userFactory, informationFactory, hustleBeeAppFactory){
	
	var auth = userFactory.getUserStatus();
	var user = userFactory.getUserData();

	$scope.error = false

	if (auth === true && user.employer === true) {
		$rootScope.loggedIn = true;
	}
  else{
    $state.go('login');
  }

	$scope.loadShifts = function() {
		informationFactory.post(user, '/getShifts', function(success){
			var allShifts = success;
			$scope.shiftTable = false;
			$scope.searchBar = false;
			$scope.message = true

			if (allShifts.length > 0) {
				$scope.shiftTable = true;
				$scope.searchBar = true;
				$scope.message = false;

				for(item in allShifts){
					if(allShifts[item]['accepted'] === 0){
						allShifts[item]['accepted'] = 'Pending';
					} else if(allShifts[item]['accepted'] === 1) {
						allShifts[item]['accepted'] = 'Accepted';
					} else {
						allShifts[item]['accepted'] = 'Completed';
					}

					var shiftDurationTimeFormat= '';
					var shiftHour = Math.floor((allShifts[item]['duration']) / 60);
					var shiftMinutes = (allShifts[item]['duration'] % 60);
					shiftDurationTimeFormat = shiftHour + 'H' + shiftMinutes + 'M';

					allShifts[item]['duration'] = shiftDurationTimeFormat;

					var shiftAddress = allShifts[item]['shiftAddress'];
					var shiftAddressStr = ''
					if(shiftAddress['suite']) {
						shiftAddressStr = shiftAddress['street'] + " Suite " + shiftAddress['suite'] + ", " + shiftAddress["city"] + ", " + shiftAddress["state"] + " " + shiftAddress["zipcode"];
					} else {
						shiftAddressStr = shiftAddress['street'] + ", " + shiftAddress["city"] + ", " + shiftAddress["state"] + " " + shiftAddress["zipcode"];
					}

					allShifts[item]['shiftAddress'] = shiftAddressStr;
					
				}
			} else {
				$scope.errorMessage = "You have no posted shifts. Go post one and enjoy a 'me' day!"
			}
			$scope.allShifts = allShifts;
		})
	}

	$scope.loadShifts();

	$scope.deleteShift = function(shiftId){
		var shiftId = {id: shiftId};
		informationFactory.post(shiftId, '/deleteShift', function(success){
			if (success.error == "cannot delete"){
				$scope.error = true;
				$scope.errorMessage = "Cannot delete shifts that are in progress. Please contact us if you have additional questions."
			} else {
				$scope.loadShifts();
			}
		})
	}	
})

