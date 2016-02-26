var hustleBeeAppModule = angular.module('hustleBeeApp', ['ngRoute', 'ui.router', 'ui.bootstrap', 'ngMessages', 'stormpath','stormpath.templates', 'angulartics', 'angulartics.google.analytics', 'uiGmapgoogle-maps']);

hustleBeeAppModule.run(function ($state, $rootScope, hustleBeeAppFactory, $location) {
	$rootScope.$on('$stateChangeStart', function (event, to) {
		var auth = hustleBeeAppFactory;
		if((to.data && to.data.loggedInUser === true) && (auth.getUserStatus() === null || auth.getUserStatus() === false)){
			$state.go('business.home');
			event.preventDefault();
		}
	})
})

hustleBeeAppModule.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider){

	uiGmapGoogleMapApiProvider.configure({
		key: 'AIzaSyD2n9kPrHgQmlZupGpnMpJhuffDFPx7GdE',
		v: '3.20',
		libraries: 'weather,geometry,visualization'
	});

	$urlRouterProvider.otherwise(function($injector, $location){
		var $state = $injector.get("$state");
		$state.go('home');
	})

	$stateProvider
		.state('home', {
			url: '',
			templateUrl: '/static/partials/homepage.html',
			caseInsensitiveMatch: true,
			controller: 'HomepageController'
		})

		.state('business', {
			url: '',
			templateUrl: '/static/partials/dashboard.html',
			caseInsensitiveMatch: true,
			controller: 'DashboardController'
		})

		.state('business.login', {
			url: '/business/login',
			templateUrl: '/static/partials/login.html',
			caseInsensitiveMatch: true
		})

		.state('business.register', {
			url: '/business/register',
			templateUrl: '/static/partials/register.html',
			caseInsensitiveMatch: true
		})

		.state('business.forgot', {
			url: '/business/forgot',
			templateUrl: '/static/partials/forgot.html',
			caseInsensitiveMatch: true,
			controller: 'ForgotPasswordController'
		})

		.state('business.reset', {
			url: '/business/reset/:id',
			caseInsensitiveMatch: true,
			controller: 'ResetPasswordController'
		})

		.state('business.resetPassword', {
			url: '/business/resetPassword',
			templateUrl: '/static/partials/resetPassword.html',
			caseInsensitiveMatch: true,
			controller: 'NewPasswordController'
		})

		.state('business.home', {
			url: '/business/home',
			templateUrl: '/static/partials/businessesHome.html',
			caseInsensitiveMatch: true,
			controller: 'BusinessHomeController'
		})

		.state('business.user', {
			url: '/business/user',
			templateUrl: '/static/partials/userBusinessHome.html',
			caseInsensitiveMatch: true,
			controller: 'UserHomePageController',
			data: {
				loggedInUser: true
			}
		})

		.state('business.postShift', {
			url: '/business/postShift',
			templateUrl: '/static/partials/postJob.html',
			caseInsensitiveMatch: true,
			controller: 'JobPostingController',
			data: {
				loggedInUser: true
			}
		})

		.state('business.settings', {
			url: '/business/settings',
			templateUrl: '/static/partials/settings.html',
			caseInsensitiveMatch: true,
			controller: 'SettingsController',
			data: {
				loggedInUser: true
			}
		})
});


hustleBeeAppModule.factory('hustleBeeAppFactory', function($q, $timeout, $http){
	var user = null;

	var userInfo = null;

	var factory = {};

	factory.isLoggedIn = function() {
		if(user) {
			return true;
		} else {
			return false;
		}
	}

	factory.getUserStatus = function() {
		return user;
	}

	factory.getUserData = function() {
		return userInfo;
	}

	factory.signUp = function(data, callback){
		$http.post('/signUp', data).success(function(data){
			callback(data);
		})
	};

	factory.login = function(data, callback){
		var deferred = $q.defer();

		$http.post('/login', data).success(function(data){
			if (data.username) {
				user = true;
				userInfo = data;
				deferred.resolve();
				callback(data);
			} else {
				user = false;
				deferred.reject();
				callback(data)
			}
		}).error(function(error){
			user = false;
			deferred.reject();
		});

		return deferred.promise;
	};

	factory.register = function(data, callback){
		var deferred = $q.defer();

		$http.post('/register', data).success(function(data){
			if (data.username){
				user = true;
				userInfo = data;
				deferred.resolve();
				callback(data)
			} else {
				user = false;
				deferred.reject();
				callback(data)
			}
		}).error(function(error){
			deferred.reject();
		});

		return deferred.promise;
	};

	factory.logout = function(callback){
		var deferred = $q.defer()

		$http.get('/logout').success(function(data){
			user = false;
			deferred.resolve();
			callback(data);
		}).error(function(error){
			user = false;
			deferred.reject();
		});

		return deferred.promise;
	};

	factory.forgot = function(data, callback){
		$http.post('/forgot', data).success(function(data){
			userInfo = data;
			callback(data);
		})
	};

	factory.reset = function(data, callback) {
		$http.post('/reset', data).success(function(data){
			if(data === null) {
				var userError = "Expired token";
				userInfo = userError;
			} else {
				userInfo = data;
			}

			callback(data);
		})
	}

	factory.newPassword = function(data, callback){
		$http.post('/newPassword', data).success(function(data){
			if(data.message === 'Error reseting'){
				var userError = "Expired token";
				userInfo = userError;
			}
			callback(data);
		})
	};

	factory.postShift = function(data, callback){
		$http.post('/postShift', data).success(function(data){
			callback(data);
		})
	};

	factory.getShifts = function(data, callback){
		$http.post('/getShifts', data).success(function(data){
			callback(data);
		})
	};

	factory.deleteShift = function(data, callback){
		$http.post('/deleteShift', data).success(function(data){
			callback(data);
		})
	};

	factory.addAddress = function(data, callback){
		$http.post('/addAddress', data).success(function(data){
			callback(data);
		})
	};

	factory.deleteAddress = function(data, callback){
		$http.post('/deleteAddress', data).success(function(data){
			callback(data);
		})
	}

	factory.getUpdatedUserData = function(data, callback){
		var userId = {id: data};
		$http.post('/getUser', userId).success(function(data){
			userInfo = data;
			callback(data);
		})
	}

	factory.updateUser = function(data, callback){
		$http.post('/updateUser', data).success(function(data){
			callback(data);
		})
	}

	factory.geoCode = function(data, callback){
		var address = data.replace(/ /g, '+');
		$http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address).success(function(data){
			if (data.status == "OK") {
				var lat = data.results[0].geometry.location.lat;
				var lng = data.results[0].geometry.location.lng;
				var coordinate = {latitude: lat, longitude: lng};
				callback({status: "OK", coordinate: coordinate});
			} else {
				callback({error: 'Geocode error'});
			}
		})
	}

	return factory;
});

hustleBeeAppModule.controller('HomepageController', function($scope, $location, $uibModal, $state, $stateParams, hustleBeeAppFactory){
	$scope.emailSignUp = function(signupForm){
		if(angular.isUndefined($scope.signup)){
			$scope.error = "Opps! Did you forget to enter all your information?";
			$scope.success = ''
		}else if(angular.isUndefined($scope.signup.name) || angular.isUndefined($scope.signup.email) || angular.isUndefined($scope.signup.email)){
			$scope.error = "Opps! Did you forget to enter all your information?";
			$scope.success = '';
		}else{
			hustleBeeAppFactory.signUp($scope.signup, function(data){
				// if(data){
				// 	$state.go('signupSuccess');
				// }
			})
			
			$scope.signupForm.$setPristine();
			$scope.signupForm.$setUntouched();
			$scope.signup = {};
			$scope.error = "";
			$scope.success = "See-Bee-See. Thanks for signing up!";
		}	
	};

	$scope.businessPage = function() {
		var auth = hustleBeeAppFactory.getUserStatus();

		if (auth === true){
			$state.go('business.user');
		} else {
			$state.go('business.home');
		}
	}

});

hustleBeeAppModule.controller('DashboardController', function($scope, $rootScope, $uibModal, $location, $state, $stateParams, hustleBeeAppFactory){

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

hustleBeeAppModule.controller('AuthController', function($scope, $rootScope, $uibModal, $uibModalInstance, $location, $state, $stateParams, hustleBeeAppFactory){

 	$scope.error = false;
	$scope.disabled = true;

	$scope.close = function() {
		$uibModalInstance.dismiss('cancel');
	}

	$scope.login = function(user){
		hustleBeeAppFactory.login(user, function(data){
			if(data.username){
				$uibModalInstance.dismiss('cancel');
				$state.go('business.user');
				$scope.disabled = false;
				$scope.user = {};
			} else {
				$scope.error = true;
				$scope.errorMessage = "Invalid username or password";
				$scope.disabled = false;
          		$scope.user = {};
			}
		})
	}

	$scope.register = function(newUser){
		if(angular.isUndefined(newUser)){
			$scope.error = true;
			$scope.errorMessage = "All fields are required.";
		} else
		if (angular.isUndefined(newUser.firstName) || angular.isUndefined(newUser.lastName) || angular.isUndefined(newUser.companyName) || angular.isUndefined(newUser.email) || angular.isUndefined(newUser.username) || angular.isUndefined(newUser.password)){
			$scope.error = true;
			$scope.errorMessage = "All fields are required.";
		} else if ((newUser.firstName === '') || (newUser.lastName === '') || (newUser.companyName === '') || (newUser.email === '') || (newUser.username === '') || (newUser.password === '')){
			$scope.error = true;
			$scope.errorMessage = "All fields are required.";
		} else {
			hustleBeeAppFactory.register(newUser, function(data){
				if(data.username){
					$uibModalInstance.dismiss('cancel');
					$state.go('business.user');
					$scope.error = false;
					$scope.disabled = false;
					$scope.newUser = {};
				} else {
					$scope.error = true;
					$scope.errorMessage = data[0];
					$scope.disabled = false;
					$scope.newUser = {};
				}
			})
		}
	}

	$scope.forgot = function(){
		$uibModalInstance.dismiss('cancel');
		$state.go('business.forgot');
	}


})

hustleBeeAppModule.controller('ForgotPasswordController', function($scope, $uibModal, $rootScope, $state, $stateParams, hustleBeeAppFactory){
	
	$scope.error = false;
	$scope.success = false;
	$scope.info = false;
	
	var userData = hustleBeeAppFactory.getUserData()
	
	if(userData === 'Expired token'){
		$scope.info = true;
		$scope.infoMessage = 'Password reset token is invalid or has expired.'
	}
	
	$scope.emailReset = function(user){
		$scope.info = false;

		if (user === false){
			$scope.error = true;
			$scope.errorMessage = "Email is required."
			return
		}
		hustleBeeAppFactory.forgot(user, function(success){
			if(success.msg === 'No account with that email address exists.'){
				$scope.user = {};
				$scope.error = true;
				$scope.success = false;
				$scope.errorMessage = success.msg;
			} else {
				$scope.user = {};
				$scope.error = false;
				$scope.success = true;
				$scope.successMessage = success.msg;
			}
		})
	}
})

hustleBeeAppModule.controller('ResetPasswordController', function($scope, $state, $stateParams, hustleBeeAppFactory){

	hustleBeeAppFactory.reset($stateParams, function(success){
		if(success){
			$state.go('business.resetPassword');
		} else {
			$state.go('business.forgot');
		}
	})
})

hustleBeeAppModule.controller('NewPasswordController', function($scope, $state, $stateParams, hustleBeeAppFactory){

	$scope.error = false;
	$scope.success = false;
	$scope.info = false;

	var userData = hustleBeeAppFactory.getUserData();

	if(userData === null){
		$state.go('business.forgot');	
	} else {
		$scope.passwordReset = function(user){
			if(angular.isUndefined(user.password) || angular.isUndefined(user.passwordAgain) || (user.password === '') || (user.passwordAgain === '')) {
				$scope.error = true;
				$scope.errorMessage = "All fields are required."
			} else {
				$scope.error = false;
				$scope.errorMessage = "";

				if (user.password != user.passwordAgain){
					$scope.error = true;
					$scope.errorMessage = "Passwords do not match. Try again!"
					$scope.user = {};
				} else {
					$scope.error = false;
					$scope.errorMessage = "";
					var userReset = {};
					userReset.token = userData.resetPasswordToken;
					userReset.password = user.password;
					hustleBeeAppFactory.newPassword(userReset, function(success){
						if(success.message === 'Error reseting') {
							$state.go('business.forgot');
						} 
						if(success.message === 'success'){
							$scope.user = {};
							$scope.success = true;
							$scope.successMessage = "Your password has been successfully changed.";
						}
					})
				}
			}
		}
	}
})


hustleBeeAppModule.controller('BusinessHomeController', function($scope, $uibModal, $rootScope, $state, $stateParams, hustleBeeAppFactory){
	var auth = hustleBeeAppFactory

	if (auth.getUserStatus() === true) {
		$rootScope.loggedIn = true;
	} else {
		$rootScope.loggedIn = false;
	}
	
	$scope.jobPositions = [{
		value: "Outpatient Pharmacist", 
		label: "Outpatient Pharmacist"
	}, {
		value: "Inpatient Pharmacist",
		label: "Inpatient Pharmacist"
	}, {
		value: "Pharmacy Technician",
		label: "Pharmacy Technician"
	}];

	$scope.postingJob = function(jobPost){
		if(auth.getUserStatus() === true){
			$state.go('business.user');
		} else {
			var modalInstance = $uibModal.open({
				animation: true,
				size: 'sm',
				templateUrl: '/static/partials/login_modal.html',
				controller: 'AuthController'
			})
		}
	}

})

hustleBeeAppModule.controller('UserHomePageController', function($scope, $rootScope, $state, $stateParams, hustleBeeAppFactory){
	
	var auth = hustleBeeAppFactory.getUserStatus();
	var user = hustleBeeAppFactory.getUserData();

	if (auth === true) {
		$rootScope.loggedIn = true;
	}

	$scope.loadShifts = function() {
		hustleBeeAppFactory.getShifts(user, function(success){
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
		hustleBeeAppFactory.deleteShift(shiftId, function(success){
			if(success){
				$scope.loadShifts();
			}
		})
	}	
})

hustleBeeAppModule.controller('JobPostingController', function($scope, $state, $stateParams, hustleBeeAppFactory){
	
	$scope.error = false;
	
	var auth = hustleBeeAppFactory;
	var userInfo = hustleBeeAppFactory.getUserData();

	var getUserAddresses = function(){
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
				addressToAdd.value = item;
				addressToAdd.label = addressStr;
				$scope.addresses.push(addressToAdd);
			} else {
				addressStr = street + ' Suite ' + suite + ', ' + city + ', ' + state + ' ' + zipcode;
				var addressToAdd = {};
				addressToAdd.value = item;
				addressToAdd.label = addressStr;
				$scope.addresses.push(addressToAdd);
			}

		}
	}

	getUserAddresses();

	$scope.startTimeHours = [{value: 0, label: "00"}, {value: 1, label: "1"}, {value: 2, label: "2"}, {value: 3, label: "3"}, {value: 4, label: "4"}, {value: 5, label: "5"}, {value: 6, label: "6"}, {value: 7, label: "7"}, {value: 8, label: "8"}, {value: 9, label: "9"}, {value: 10, label: "10"}, {value: 11, label: "11"}, {value: 12, label: "12"}, {value: 13, label: "13"}, {value: 14, label: "14"}, {value: 15, label: "15"}, {value: 16, label: "16"}, {value: 17, label: "17"}, {value: 18, label: "18"}, {value: 19, label: "19"}, {value: 20, label: "20"}, {value: 21, label: "21"}, {value: 22, label: "22"}, {value: 23, label: "23"} ];

	$scope.startTimeMins = [{value: 00, label: "00"}, {value: 15, label: "15"}, {value: 30, label: "30"}, {value: 45, label: "45"}];

	$scope.shiftHours = [{value: 1, label: "1"}, {value: 2, label: "2"}, {value: 3, label: "3"}, {value: 4, label: "4"}, {value: 5, label: "5"}, {value: 6, label: "6"}, {value: 7, label: "7"}, {value: 8, label: "8"}, {value: 9, label: "9"}, {value: 10, label: "10"}, {value: 11, label: "11"}, {value: 12, label: "12"}];

	$scope.shiftMins = [{value: 00, label: "00"}, {value: 15, label: "15"}, {value: 30, label: "30"}, {value: 45, label: "45"}];

	$scope.jobPositions = [{
		value: "Outpatient Pharmacist", 
		label: "Outpatient Pharmacist - $100/hr"
	}, {
		value: "Inpatient Pharmacist",
		label: "Inpatient Pharmacist - $120/hr"
	}, {
		value: "Pharmacy Technician",
		label: "Pharmacy Technician - $40/hr"
	}];
	
	$scope.post = function(shiftDate, startTimeHour, startTimeMin, shiftHour, shiftMin, jobPosition, address){
		if (angular.isUndefined(jobPosition) || angular.isUndefined(shiftDate) || angular.isUndefined(startTimeHour) || angular.isUndefined(startTimeMin) || angular.isUndefined(shiftHour) || angular.isUndefined(shiftMin) || angular.isUndefined(address)) {
			$scope.errorMessage = "All fields are required. Go to Profile > Settings to add location.";
			$scope.error = true;
		} else {
			$scope.error = false;
			var userInfo = hustleBeeAppFactory.getUserData();
			var userId = userInfo._id;
			var hourToMins = shiftHour.value * 60;
			var shiftDuration = hourToMins + shiftMin.value;
			var startTime = (startTimeHour.value*60)  + startTimeMin.value;
			var shiftAddress = userInfo.addresses[address.value];
			var shift = {};
			shift["date"] = shiftDate;
			shift["startTime"] = startTime;
			shift["duration"] = shiftDuration;
			shift["position"] = jobPosition.value;
			shift["employer"] = userId;
			shift["accepted"] = 0;
			shift["shiftAddress"] = shiftAddress;

			var shiftData = {};
			shiftData.shift = shift;
			shiftData.userInfo = userInfo;


			hustleBeeAppFactory.postShift(shiftData, function(data){
				if(data){
					$state.go('business.user');
				} else {
					return
				}
			})
		}
	}
})

hustleBeeAppModule.controller('SettingsController', function($scope, $state, $uibModal, $stateParams, hustleBeeAppFactory){
	
	$scope.success = false;

	var userInfo = hustleBeeAppFactory.getUserData();

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
		hustleBeeAppFactory.getUpdatedUserData(userInfo._id, function(data){
			userInfo = data;
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
			templateUrl: '/static/partials/address_modal.html',
			controller: 'ModalController'
		})
	}

	$scope.delete = function(id){
		if (angular.isUndefined(id)){
			return
		} else {
			var addressId = {addressId: id};
			hustleBeeAppFactory.deleteAddress(addressId, function(data){
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
			hustleBeeAppFactory.updateUser(user, function(data){
				if(data){
					getUpdatedUserData();
					$scope.success = true;
					$scope.successMessage = data.msg;
				}
			})
		}
	}

})

hustleBeeAppModule.controller('ModalController', function($scope, $rootScope, $state, $uibModalInstance, hustleBeeAppFactory, uiGmapGoogleMapApi){

	$scope.error = false;
	$scope.success = false;

	var userInfo = hustleBeeAppFactory.getUserData();

	$scope.states = [{value: "CA", label: "CA"}];

	$scope.close = function() {
		$uibModalInstance.dismiss('cancel');
		$rootScope.$broadcast('updateUser');
	}

	$scope.addAddress = function(address, state){
		if(angular.isUndefined(address)) {
			$scope.error = true;
			$scope.errorMessage = "All fields are required.";
		} else if(angular.isUndefined(address.street) || angular.isUndefined(address.street) || angular.isUndefined(address.city) || angular.isUndefined(address.zipcode) || angular.isUndefined(state)){

			$scope.error = true;
			$scope.success = false;
			$scope.errorMessage = "All fields are required.";
		} else {
			var	address = address;
			address.state = state.value;
			address.userId = userInfo._id;

			var geoCodeAddress = address.street + " " + address.city + " " + address.state + " " + address.zipcode;
			
			hustleBeeAppFactory.geoCode(geoCodeAddress, function(data){
				if (data.status == "OK") {
					$scope.error = false;
					$scope.errorMessage = ""
					address.coordinate = data.coordinate;

					hustleBeeAppFactory.addAddress(address, function(data){
						if(data){
							$scope.success = true;
							$scope.successMessage = "Address added successfully! Add another?";
							$rootScope.$broadcast('updateUser');
							$scope.address = {};
							$scope.state = {};
						}
					})
				} else {
					$scope.error = true;
					$scope.errorMessage = "Invalid address."
					return
				}
			})
			
			
			
		}	
	}

})


