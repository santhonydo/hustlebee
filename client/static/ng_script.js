var hustleBeeAppModule = angular.module('hustleBeeApp', ['ngRoute', 'ui.router', 'ui.bootstrap', 'ngMessages', 'stormpath','stormpath.templates', 'angulartics', 'angulartics.google.analytics', 'uiGmapgoogle-maps']);

hustleBeeAppModule.run(function ($state, $rootScope, hustleBeeAppFactory, $location) {
	$rootScope.$on('$stateChangeStart', function (event, to) {
		var auth = hustleBeeAppFactory;
		if((to.data && to.data.loggedInUser === true) && (auth.getUserStatus() === null || auth.getUserStatus() === false)){
			$state.go('login');
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

  .state('admin', {
    url: '',
    templateUrl: '/static/partials/adminDashboard.html',
    caseInsensitiveMatch: true,
    controller: 'AdminController'
  })

  .state('admin.login', {
    url: '/admin',
    templateUrl: '/static/partials/adminLogin.html',
    caseInsensitiveMatch: true,
  })

  .state('admin.main', {
    url: '/admin/main',
    templateUrl: '/static/partials/adminMain.html',
    caseInsensitiveMatch: true,
    controller: 'AdminMainController'
  })

		//Business Section

		.state('business', {
			url: '',
			templateUrl: '/static/partials/dashboard.html',
			caseInsensitiveMatch: true,
			controller: 'DashboardController'
		})

		.state('login', {
			url: '/business/login',
			templateUrl: '/static/partials/login.html',
			caseInsensitiveMatch: true,
			controller: 'AuthController'
		})

		.state('register', {
			url: '/business/register',
			templateUrl: '/static/partials/register.html',
			caseInsensitiveMatch: true,
			controller: 'AuthController'
		})

		.state('forgot', {
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

// hustleBeeAppModule.controller('ModalController', function($scope, $rootScope, $state, $uibModalInstance, hustleBeeAppFactory, uiGmapGoogleMapApi){

// 	$scope.error = false;
// 	$scope.success = false;

// 	var userInfo = hustleBeeAppFactory.getUserData();

// 	$scope.states = [{value: "CA", label: "CA"}];

// 	$scope.close = function() {
// 		$uibModalInstance.dismiss('cancel');
// 		$rootScope.$broadcast('updateUser');
// 	}

// 	$scope.addAddress = function(address, state){
// 		if(angular.isUndefined(address)) {
// 			$scope.error = true;
// 			$scope.errorMessage = "All fields are required.";
// 		} else if(angular.isUndefined(address.street) || angular.isUndefined(address.street) || angular.isUndefined(address.city) || angular.isUndefined(address.zipcode) || angular.isUndefined(state)){

// 			$scope.error = true;
// 			$scope.success = false;
// 			$scope.errorMessage = "All fields are required.";
// 		} else {
// 			var	address = address;
// 			address.state = state.value;
// 			address.userId = userInfo._id;

// 			var geoCodeAddress = address.street + " " + address.city + " " + address.state + " " + address.zipcode;
			
// 			hustleBeeAppFactory.geoCode(geoCodeAddress, function(data){
// 				if (data.status == "OK") {
// 					$scope.error = false;
// 					$scope.errorMessage = ""
// 					address.coordinate = data.coordinate;

// 					hustleBeeAppFactory.addAddress(address, function(data){
// 						if(data){
// 							$scope.success = true;
// 							$scope.successMessage = "Address added successfully! Add another?";
// 							$rootScope.$broadcast('updateUser');
// 							$scope.address = {};
// 							$scope.state = {};
// 						}
// 					})
// 				} else {
// 					$scope.error = true;
// 					$scope.errorMessage = "Invalid address."
// 					return
// 				}
// 			})
// 		}	
// 	}

// })


