var hustleBeeAppModule = angular.module('hustleBeeApp', ['ngRoute', 'ui.router', 'ui.bootstrap', 'ngMessages', 'angulartics', 'angulartics.google.analytics']);


hustleBeeAppModule.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: '/static/partials/homepage.html',
			caseInsensitiveMatch: true,
			controller: 'HomepageController'
		})

		.state('posting_job', {
			url: '/posting_job',
			templateUrl: '/static/partials/posting_job.html',
			caseInsensitiveMatch: true,
			controller: 'PostingJobController'
		})

		.state('logIn', {
			url: '/login',
			templateUrl: '/static/partials/login.html',
			caseInsensitiveMatch: true,
			controller: 'AuthController',
			params: {
				obj: null
			}
		})

		.state('register', {
			url: '/register',
			templateUrl: '/static/partials/register.html',
			caseInsensitiveMatch: true,
			controller: 'AuthController',
			params: {
				obj: null
			}
		})

		.state('dashboard', {
			url: '/dashboard',
			templateUrl: '/static/partials/dashboard.html',
			caseInsensitiveMatch: true,
			controller: 'DashboardController',
			params: {
				obj: null
			}
		})
});

hustleBeeAppModule.factory('hustleBeeAppFactory', function($http){
	var factory = {};

	factory.signUp = function(data, callback){
		$http.post('/signUp', data).success(function(success){
			callback(success);
		})
	};

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

	$scope.open = function() {
		var modalInstance = $uibModal.open({
    		animation: true,
      		templateUrl: '/static/partials/job_posting_modal.html',
      		controller: 'JobPostingModalController',
    	});
	}
});

hustleBeeAppModule.controller('JobPostingModalController', function($scope, $location, $state, $stateParams, $uibModalInstance) {
	
	$scope.close = function(){
    	$uibModalInstance.dismiss('cancel');
  	};

	$scope.jobPosition = ["Outpatient Pharmacist", "Inpatient Pharmacist", "Pharmacy Technician", "Pharmacy Clerk"]

	$scope.postJob = function(postingJob) {
		if((angular.isUndefined($scope.postingJob.name) || angular.isUndefined($scope.postingJob.jobPosition) || angular.isUndefined($scope.postingJob.jobDescription)) || ($scope.postingJob.name == "" || $scope.postingJob.jobPostion == "" || $scope.postingJob.jobDescription == "")){
			$scope.error = "Please enter all fields";
		}else {
			$state.go('logIn', {obj: $scope.postingJob});
			$uibModalInstance.dismiss();
			$scope.postingJob = {};
			$scope.error ="";
		}
	}
});



