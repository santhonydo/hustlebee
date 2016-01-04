var hustleBeeAppModule = angular.module('hustleBeeApp', ['ngRoute', 'ui.router', 'ui.bootstrap', 'ngMessages', 'angulartics', 'angulartics.google.analytics']);

hustleBeeAppModule.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/home');

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/static/partials/homepage.html',
			controller: 'HomepageController'
		})
});

hustleBeeAppModule.factory('hustleBeeAppFactory', function($http){
	var factory = {};

	factory.signUp = function(data, callback){
		$http.post('/signUp', data).success(function(success){
			callback(success);
		})
	}

	return factory;
});

hustleBeeAppModule.controller('HomepageController', function($scope, $location, hustleBeeAppFactory){
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
	}

});