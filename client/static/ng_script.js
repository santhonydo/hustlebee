var hustleBeeAppModule = angular.module('hustleBeeApp', ['ngRoute', 'ui.router', 'ui.bootstrap', 'ngMessages', 'stormpath','stormpath.templates', 'angulartics', 'angulartics.google.analytics']);

hustleBeeAppModule.run(function ($state, $rootScope, hustleBeeAppFactory, $location) {
	$rootScope.$on('$stateChangeStart', function (event, to) {
		var auth = hustleBeeAppFactory;
		if((to.data && to.data.loggedInUser === true) && (auth.getUserStatus() === null)){
			console.log(to.data);
			console.log(to.data.loggedInUser);
			console.log(auth.getUserStatus());
			// $location.path('/dashboard/dashboard.postJob')
			$state.go('dashboard.postJob');
			event.preventDefault();
		}
	})
})

hustleBeeAppModule.config(function($stateProvider, $urlRouterProvider){
	// $urlRouterProvider.otherwise('/');
	$urlRouterProvider.otherwise(function($injector, $location){
		var $state = $injector.get("$state");
		$state.go('home');
	})

	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: '/static/partials/homepage.html',
			caseInsensitiveMatch: true,
			controller: 'HomepageController',
		})

		.state('dashboard', {
			url: '/dashboard',
			templateUrl: '/static/partials/dashboard.html',
			caseInsensitiveMatch: true,
			controller: 'DashboardController'
		})

		.state('dashboard.login', {
			url: '/dashboard.login',
			templateUrl: '/static/partials/login.html',
			caseInsensitiveMatch: true,
		})

		.state('dashboard.register', {
			url: '/dashboard.register',
			templateUrl: '/static/partials/register.html',
			caseInsensitiveMatch: true,
		})

		.state('dashboard.postJob', {
			url: '/dashboard.postJob',
			templateUrl: '/static/partials/posting_job.html',
			caseInsensitiveMatch: true,
			controller: 'DashboardController',
		})

		.state('dashboard.userHome', {
			url: '/dashboard.userHome',
			templateUrl: '/static/partials/userHome.html',
			caseInsensitiveMatch: true,
			controller: 'UserHomePageController',
			data: {
				loggedInUser: true
			}
		})

		// .state('dashboard', {
		// 	url: '/dashboard',
		// 	templateUrl: '/static/partials/dashboard.html',
		// 	caseInsensitiveMatch: true,
		// 	controller: 'DashboardController',
		// 	params: {
		// 		obj: null
		// 	}
		// })
});


hustleBeeAppModule.factory('hustleBeeAppFactory', function($q, $timeout, $http){
	var user = null;

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
	}

	return factory;
});

hustleBeeAppModule.controller('HomepageController', function($scope, $location, $uibModal, $state, $stateParams, hustleBeeAppFactory){
	$scope.emailSignUp = function(signupForm){
		console.log('test');
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

});

hustleBeeAppModule.controller('JobPostingModalController', function($scope, $rootScope, $location, $state, $stateParams, $uibModalInstance, hustleBeeAppFactory) {
	
	var auth = hustleBeeAppFactory
	
	if (auth.getUserStatus() === true) {
		$rootScope.loggedIn = true
	}

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
		// console.log(hustleBeeAppFactory.getUserStatus());
		
		hustleBeeAppFactory.logout(function(success){
			if(success){
				$state.go('dashboard.postJob');
			}
		})
	}

})

hustleBeeAppModule.controller('AuthController', function($scope, $rootScope, $uibModalInstance, $location, $state, $stateParams, hustleBeeAppFactory){

 	// console.log(hustleBeeAppFactory.getUserStatus());

 	$scope.error = false;
	$scope.disabled = true;

	$scope.close = function() {
		$uibModalInstance.dismiss('cancel');
	}

	$scope.login = function(user){
		hustleBeeAppFactory.login(user, function(data){
			if(data.username){
				$uibModalInstance.dismiss('cancel');
				$state.go('dashboard.userHome');
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
		hustleBeeAppFactory.register(newUser, function(data){
			if(data.username){
				$uibModalInstance.dismiss('cancel');
				$state.go('dashboard.userHome');
				$scope.disabled = false;
				$scope.newUser = {};
				
			} else {
				$scope.error = true;
				$scope.errorMessage = "Something went wrong!";
				$scope.disabled = false;
				$scope.newUser = {};
			}
		})
	}
})

hustleBeeAppModule.controller('UserHomePageController', function($scope, $rootScope, $state, $stateParams, hustleBeeAppFactory){
	var auth = hustleBeeAppFactory

	if (auth.getUserStatus() === true) {
		$rootScope.loggedIn = true
	}

	console.log(hustleBeeAppFactory.getUserStatus());
	
})




