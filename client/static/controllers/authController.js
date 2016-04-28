

hustleBeeAppModule.controller('AuthController', function($scope, $rootScope, $location, $state, $stateParams, hustleBeeAppFactory){

 	$scope.error = false;
	$scope.disabled = true;

	$scope.login = function(user){
		hustleBeeAppFactory.login(user, function(data){
			if(data.username){
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

	$scope.registerUser = function(newUser){
		newUser.status = 0;

		if(angular.isUndefined(newUser)){
			$scope.error = true;
			$scope.errorMessage = "All fields are required.";
		} else
		if (angular.isUndefined(newUser.firstName) || angular.isUndefined(newUser.lastName) || angular.isUndefined(newUser.companyName) || angular.isUndefined(newUser.email) || angular.isUndefined(newUser.username) || angular.isUndefined(newUser.password) || angular.isUndefined(newUser.phone) || angular.isUndefined(newUser.confirmPassword)){
			$scope.error = true;
			$scope.errorMessage = "All fields are required.";
		} else if ((newUser.firstName === '') || (newUser.lastName === '') || (newUser.companyName === '') || (newUser.email === '') || (newUser.username === '') || (newUser.password === '') || (newUser.phone === '') || (newUser.confirmPassword === '')){
			$scope.error = true;
			$scope.errorMessage = "All fields are required.";
		} else if (newUser.password != newUser.confirmPassword) {
			$scope.error = true;
			$scope.errorMessage = "Passwords do not match."
		} else {
			hustleBeeAppFactory.register(newUser, function(data){
				if(data.username){
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
		$state.go('forgot');
	}

	$scope.register = function(){
		$state.go('register');
	}

	$scope.backToLogin = function() {
		$state.go('login');
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

	$scope.backToLogin = function() {
		$state.go('login');
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

	$scope.backToLogin = function() {
		$state.go('login');
	}

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
	
})