hustleBeeAppModule.controller('UserController', function($scope, $rootScope, $uibModal, $location, $state, $stateParams, hustleBeeAppFactory){
	$scope.logout = function(){	
		$rootScope.loggedIn = false;	
		hustleBeeAppFactory.logout(function(success){
			if(success){
				$state.go('userLogin');
			}
		})
	}

});

hustleBeeAppModule.controller('UserSettingsController', function($scope, $http, $rootScope, $uibModal, $location, $state, $stateParams, hustleBeeAppFactory){
	var userInfo = hustleBeeAppFactory.getUserData();
	var auth = hustleBeeAppFactory.getUserStatus();
	if (auth === true) {
		$rootScope.loggedIn = true;
	}
	else{
		$state.go('userLogin')
	}
  $scope.success = false;

	if (userInfo.status == 1) {
		$scope.employerStatus = "Verified";
		$scope.unverified = false;
		$scope.verified = true;
	} else {
		$scope.employerStatus = "Unverified License";
		$scope.unverified = true;
		$scope.verified = false;
	}

	if(auth === true){
		$rootScope.loggedIn = true;
	}
	else{
		$state.go('userLogin')
	}

	$scope.uploadFile = function(){
		var file = $scope.myFile;
		var fd = new FormData();
		fd.append('file', file);
    fd.append('userId', userInfo._id);

    hustleBeeAppFactory.uploadPicture(fd, function(output){
      if(output === 'success'){
        $scope.success = true;
      }
    })
	};

	var getUserInfo = function(){
		$scope.user = userInfo;
    if(userInfo.addresses[0]){
      $scope.user.address= [userInfo.addresses[0]];
    }
    else{
      $scope.user.address = 'Please add an Address';
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

	$scope.updateUser = function(user){
		if(angular.isUndefined(user.phoneNumber)){
			return
		} else {
			hustleBeeAppFactory.employeeUpdateUser(user, function(data){
				if(data){
					getUpdatedUserData();
					$scope.success = true;
					$scope.successMessage = data.msg;
				}
			})
		}
	}

});

hustleBeeAppModule.controller('UserMainController', function($scope, $rootScope, $uibModal, $location, $state, $stateParams, hustleBeeAppFactory){
	var user = hustleBeeAppFactory.getUserData();
	var auth = hustleBeeAppFactory.getUserStatus();
	if (auth === true && user.employer === false) {
  $scope.status = user.status;
		$rootScope.loggedIn = true;
	}
	else{
		$state.go('userLogin')
	}

	var getShifts = function(){
		hustleBeeAppFactory.getAvailableShifts(user._id, function(output){
      console.log(output);
      console.log(user);
			$scope.shifts = output.unaccepted;
			$scope.accepted = output.accepted;
			for(var x in $scope.shifts){
				var temp = $scope.shifts[x].startTime;
				var number1 , number2;
				$scope.shifts[x].hours = ($scope.shifts[x].duration - ($scope.shifts[x].duration % 60)) / 60;
				$scope.shifts[x].minutes = $scope.shifts[x].duration % 60 ;
				$scope.shifts[x].startTime = {} ;
				number1 = (temp - (temp % 60)) / 60;
				number1 = number1.toString();
				if(number1.length < 2){
					number1 = '0' + number1;
				}
				$scope.shifts[x].startTime.hour = number1;
				number2 = temp % 60;
				number2 = number2.toString();
				if(number2.length < 2){
					number2 = '0' + number2;
				}
				$scope.shifts[x].startTime.minute = number2;
			}
			for(var x in $scope.accepted){
				var temp = $scope.accepted[x].startTime;
				var number1 , number2;
				$scope.accepted[x].hours = ($scope.accepted[x].duration - ($scope.accepted[x].duration % 60)) / 60;
				$scope.accepted[x].minutes = $scope.accepted[x].duration % 60 ;
				$scope.accepted[x].startTime = {} ;
				number1 = (temp - (temp % 60)) / 60;
				number1 = number1.toString();
				if(number1.length < 2){
					number1 = '0' + number1;
				}
				$scope.accepted[x].startTime.hour = number1;
				number2 = temp % 60;
				number2 = number2.toString();
				if(number2.length < 2){
					number2 = '0' + number2;
				}
				$scope.accepted[x].startTime.minute = number2;
			}
		})
	}

	$scope.acceptShift = function(shift){
		var data = {
			shiftId:  shift.shiftId,
      employerEmail: shift.employerEmail,
      employeeEmail: user.email,
      employeeName: user.firstName + ' ' + user.lastName,
      employerFirstName: shift.employerFirstName,
      shiftDate: shift.date,
			userId: user._id
		};
		hustleBeeAppFactory.updateShift(data, function(data){
			getShifts();
		})
	}

	getShifts();

});

hustleBeeAppModule.controller('UserLoginController', function($scope, $rootScope, $uibModal, $location, $state, $stateParams, hustleBeeAppFactory){

	$scope.forgot = function(){
		$state.go('forgot');
	}

	$scope.register = function(){
		$location.path('/employee/register')
	}

	$scope.login = function(user){
		hustleBeeAppFactory.loginUser(user, function(data){
			if(data.username){
				$state.go('user.main');
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

});

hustleBeeAppModule.controller('UserRegisterController', function($scope, $rootScope, $uibModal, $location, $state, $stateParams, hustleBeeAppFactory){


	$scope.workerOccupation = [{value: "Outpatient Pharmacist", label: "Outpatient Pharmacist"}, {value: "Inpatient Pharmacist", label: "Inpatient Pharmacist"}, {value: "Intern Pharmacist", label: "Intern Pharmacist"}, {value: "Pharmacy Technician", label: "Pharmacy Technician"}]

	$scope.workerStateLicense = [
		{value: "Alabama", label: "Alabama"}, 
		{value: "Alaska", label: "Alaska"}, 
		{value: "Arizona", label: "Arizona"}, 
		{value: "Arkansas", label: "Arkansas"}, 
		{value: "California", label: "California"}, 
		{value: "Colorado", label: "Colorado"}, 
		{value: "Connecticut", label: "Connecticut"}, 
		{value: "Delaware", label: "Delaware"}, 
		{value: "Florida", label: "Florida"}, 
		{value: "Georgia", label: "Georgia"}, 
		{value: "Hawaii", label: "Hawaii"}, 
		{value: "Idaho", label: "Idaho"}, 
		{value: "Illinois", label: "Illinois"}, 
		{value: "Indiana", label: "Indiana"}, 
		{value: "Iowa", label: "Iowa"}, 
		{value: "Kansas", label: "Kansas"}, 
		{value:"Kentucky", label: "Kentucky"}, 
		{value: "Louisiana", label: "Louisiana"}, 
		{value: "Maine", label: "Maine"}, 
		{value: "Maryland", label: "Maryland"}, 
		{value: "Massachusetts", label: "Massachusetts"}, 
		{value: "Michigan", label: "Michigan"}, 
		{value: "Minnesota", label: "Minnesota"}, 
		{value: "Mississippi", label: "Mississippi"}, 
		{value: "Missouri", label: "Missouri"}, 
		{value: "Montana", label: "Montana"}, 
		{value: "Nebraska", label: "Nebraska"}, 
		{value: "Nevada", label: "Nevada"}, 
		{value: "New Hampshire", label: "New Hampshire"}, 
		{value: "New Jersey", label: "New Jersey"}, 
		{value: "New Mexico", label: "New Mexico"}, 
		{value: "New York", label: "New York"}, 
		{value: "North Carolina", label: "North Carolina"}, 
		{value: "North Dakota", label: "North Dakota"}, 
		{value: "Ohio", label: "Ohio"}, 
		{value: "Oklahoma", label: "Oklahoma"}, 
		{value: "Oregon", label: "Oregon"}, 
		{value: "Pennsylvania", label: "Pennsylvania"}, 
		{value: "Rhode Island", label: "Rhode Island"}, 
		{value: "South Carolina", label: "South Carolina"}, 
		{value: "South Dakota", label: "South Dakota"}, 
		{value: "Tennessee", label: "Tennessee"}, 
		{value: "Texas", label: "Texas"}, 
		{value: "Utah", label: "Utah"}, 
		{value: "Vermont", label: "Vermont"}, 
		{value: "Virginia", label: "Virginia"}, 
		{value: "Washington", label: "Washington"}, 
		{value: "West Virginia", label: "West Virginia"}, 
		{value: "Wisconsin", label: "Wisconsin"}, 
		{value: "Wyoming", label: "Wyoming"}]

		$scope.backToLogin = function() {
			$location.path('/employee/login')
		}

		$scope.registerUser = function(newUser, occupation, stateLicense) {

			if(angular.isUndefined($scope.newUser) || angular.isUndefined($scope.occupation) || angular.isUndefined($scope.stateLicense)){
				$scope.success = null;
				$scope.error = "Opps! Did you forget to enter all your information correctly?";
			} else if(angular.isUndefined($scope.newUser.firstName) || angular.isUndefined($scope.occupation.value) || angular.isUndefined($scope.stateLicense.value) || angular.isUndefined($scope.newUser.lastName) || angular.isUndefined($scope.newUser.email) || angular.isUndefined($scope.newUser.username) || angular.isUndefined($scope.newUser.password) || angular.isUndefined($scope.newUser.confirmPassword) || angular.isUndefined($scope.newUser.zipcode) || angular.isUndefined($scope.newUser.phoneNumber) || angular.isUndefined($scope.newUser.licenseNumber) || angular.isUndefined($scope.newUser.licenseExpirationDate)) {
				$scope.success = null;
				$scope.error = "Opps! Did you forget to enter all your information correctly?";
			} else {
				newUser.occupation = occupation.value;
				newUser.stateLicense = stateLicense.value;

				hustleBeeAppFactory.registerUser(newUser, function(data){
					if(data.userExist) {
						$scope.success = null;
						$scope.error = "Opps! This email address has already been registered."
					} else if (data.regError) {
						$scope.success = null;
						$scope.error = ":( Something went wrong. Please try again."
					} else {
						$scope.error = null;
						$scope.newUser = {};
						$scope.occupation = "";
						$scope.stateLicense = "";
						$scope.success = "Woohoo, success! :) Our service representative will be in touch with you shortly."
					}
				})
			}
		}



});

