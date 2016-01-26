var hustleBeeAppModule = angular.module('hustleBeeApp', ['ngRoute', 'ui.router', 'ui.bootstrap', 'ngMessages', 'angulartics', 'angulartics.google.analytics']);

hustleBeeAppModule.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/home');

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/static/partials/homepage.html',
			controller: 'HomepageController'
		})

		.state('posting_job', {
			url: '/posting_job',
			templateUrl: '/static/partials/posting_job.html',
			controller: 'PostingJobController'
		})

		.state('logIn', {
			url: '/log_in',
			controller: 'LogInController',
			templateUrl: '/static/partials/log_in.html',
			params: {
				obj: null
			}
		})

		.state('registration', {
			url: '/registration',
			controller: 'RegistrationController',
			templateUrl: '/static/partials/registration.html',
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
	console.log("in HomepageController")
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

hustleBeeAppModule.controller('LogInController', function($scope, $location, $state, $stateParams, hustleBeeAppFactory){
	
	$scope.registration = function() {
		$state.go('registration', $stateParams.obj)
	}
})

hustleBeeAppModule.controller('RegistrationController', function($scope, $location, $state, $stateParams, hustleBeeAppFactory){
	$scope.error = ""

	// $scope.
})


