hustleBeeAppModule.controller('SettingsController', function($scope, $state, $uibModal, $stateParams, informationFactory, userFactory, hustleBeeAppFactory){
	
	$scope.success = false;

	var userInfo = userFactory.getUserData();
	var auth = userFactory.getUserStatus();

	if (auth === false) {
		$state.go('login');
	}

	if (userInfo.status == 1) {
		$scope.employerStatus = "Verified";
		$scope.unverified = false;
		$scope.verified = true;
	} else {
		$scope.employerStatus = "Unverified Business";
		$scope.unverified = true;
		$scope.Verified = false;
	}

	var getUserInfo = function(){
		$scope.user = userInfo;
		$scope.addresses = [];
		var addresses = userInfo.addresses
		for (item in addresses){
			var addressObj = addresses[item];
			var addressStr = '';
			var street = addressObj.street;
			var suite = addressObj.suite;
			var city = addressObj.city;
			var state = addressObj.state;
			var zipcode = addressObj.zipcode;

			if (angular.isUndefined(suite) || suite === ''){
				addressStr = street + ', ' + city + ', ' + state + ' ' + zipcode;
				var addressToAdd = {};
				addressToAdd.value = addressObj._id;
				addressToAdd.label = addressStr;
				
				$scope.addresses.push(addressToAdd);
			} else {
				addressStr = street + ' Suite ' + suite + ', ' + city + ', ' + state + ' ' + zipcode;
				var addressToAdd = {};
				addressToAdd.value = addressObj._id;
				addressToAdd.label = addressStr;
				$scope.addresses.push(addressToAdd);
			}

		}
	}

	getUserInfo();

	var getUpdatedUserData = function() {
		informationFactory.post({id : userInfo._id}, '/getUser', function(output){
      userFactory.setUser(true, output);
      userInfo = userFactory.getUserData();
			getUserInfo();
		})
	}

	$scope.$on('updateUser', function(){
    getUpdatedUserData();
	})

	$scope.add = function() {
		var modalInstance = $uibModal.open({
			animation: true,
			size: 'md',
			templateUrl: '/partials/modals/address_modal.html',
			controller: 'ModalController'
		})
	}

	$scope.delete = function(id){
		if (angular.isUndefined(id)){
			return
		} else {
			var addressId = {addressId: id};
			informationFactory.post(addressId, '/deleteAddress', function(data){
				if(data){
					getUpdatedUserData();
					alert('Address has been removed successfully.');
				}
			})
		}
	}

	$scope.updateUser = function(user){
		if(angular.isUndefined(user.phoneNumber)){
			return
		} else {
			informationFactory.post(user, '/updateUser', function(data){
				if(data){
					getUpdatedUserData();
					$scope.success = true;
					$scope.successMessage = data.msg;
				}
			})
		}
	}

})
