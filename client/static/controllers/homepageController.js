hustleBeeAppModule.controller('HomepageController', function($scope, $location, $uibModal, $state, $stateParams, hustleBeeAppFactory){

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

	$scope.registerUser = function(newUser, occupation, stateLicense) {
		
		if(angular.isUndefined($scope.newUser) || angular.isUndefined($scope.occupation) || angular.isUndefined($scope.stateLicense)){
			$scope.success = null;
			$scope.error = "Opps! Did you forget to enter all your information correctly?";
		} else if(angular.isUndefined($scope.newUser.firstName) ||angular.isUndefined($scope.newUser.lastName) || angular.isUndefined($scope.newUser.email) || angular.isUndefined($scope.newUser.phone) || angular.isUndefined($scope.newUser.licenseNumber) || angular.isUndefined($scope.newUser.licenseExpirationDate)) {
			$scope.success = null;
			$scope.error = "Opps! Did you forget to enter all your information correctly?";
		} else {
			newUser.occupation = occupation.value;
			newUser.stateLicense = stateLicense.value;

			hustleBeeAppFactory.hustlebeeSignup(newUser, function(data){
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

	$scope.businessPage = function() {
		var auth = hustleBeeAppFactory.getUserStatus();

		if (auth === true){
			$state.go('business.user');
		} else {
			$state.go('employerInfoPage');
		}
	}
});
