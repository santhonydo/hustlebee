
hustleBeeAppModule.controller('UserHomePageController', function($scope, $rootScope, $state, $stateParams, hustleBeeAppFactory){
	
	var auth = hustleBeeAppFactory.getUserStatus();
	var user = hustleBeeAppFactory.getUserData();

	$scope.error = false

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
			if (success.error == "cannot delete"){
				$scope.error = true;
				$scope.errorMessage = "Cannot delete shifts that are in progress. Please contact us if you have additional questions."
			} else {
				$scope.loadShifts();
			}
		})
	}	
})

hustleBeeAppModule.controller('JobPostingController', function($scope, $state, $stateParams, hustleBeeAppFactory){
	
	$scope.error = false;
	$scope.alertMessage = false;
	
	var auth = hustleBeeAppFactory;
	var userInfo = hustleBeeAppFactory.getUserData();
	if (userInfo.status == 1) {
		$scope.unverified = false;
	} else {
		$scope.unverified = true;
		$scope.alertMessage = true;
		$scope.alertDetailMessage = "You cannot post until your account has been verified. Account verification can take up to 24 hours. If you need emergency shift coverage, contact us at support@hustlebee.com."
	}

	var getUserAddresses = function(){
		$scope.addresses = [];
		var addresses = userInfo.addresses
		if ((userInfo.status == 1) && (addresses.length == 0)) {
			$scope.alertMessage = true;
			$scope.alertDetailMessage = "Missing business address. Go to Profile > Settings to update your business address."
		} else {
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
	}

	var dateIsValid = function(shiftDate) {
		return false;
	}

	getUserAddresses();

	$scope.startTimeHours = [{value: 0, label: "00"}, {value: 1, label: "1"}, {value: 2, label: "2"}, {value: 3, label: "3"}, {value: 4, label: "4"}, {value: 5, label: "5"}, {value: 6, label: "6"}, {value: 7, label: "7"}, {value: 8, label: "8"}, {value: 9, label: "9"}, {value: 10, label: "10"}, {value: 11, label: "11"}, {value: 12, label: "12"}, {value: 13, label: "13"}, {value: 14, label: "14"}, {value: 15, label: "15"}, {value: 16, label: "16"}, {value: 17, label: "17"}, {value: 18, label: "18"}, {value: 19, label: "19"}, {value: 20, label: "20"}, {value: 21, label: "21"}, {value: 22, label: "22"}, {value: 23, label: "23"} ];

	$scope.startTimeMins = [{value: 00, label: "00"}, {value: 15, label: "15"}, {value: 30, label: "30"}, {value: 45, label: "45"}];

	$scope.shiftHours = [{value: 1, label: "1"}, {value: 2, label: "2"}, {value: 3, label: "3"}, {value: 4, label: "4"}, {value: 5, label: "5"}, {value: 6, label: "6"}, {value: 7, label: "7"}, {value: 8, label: "8"}, {value: 9, label: "9"}, {value: 10, label: "10"}, {value: 11, label: "11"}, {value: 12, label: "12"}];

	$scope.shiftMins = [{value: 00, label: "00"}, {value: 15, label: "15"}, {value: 30, label: "30"}, {value: 45, label: "45"}];

	$scope.jobPositions = [{
		value: "Outpatient Pharmacist", 
		label: "Outpatient Pharmacist - $65 + 20% Service Fee/Hr"
	}, {
		value: "Inpatient Pharmacist",
		label: "Inpatient Pharmacist - $70 + 20% Service Fee/Hr"
	}, {
		value: "Pharmacy Technician",
		label: "Pharmacy Technician - $20 + 20% Service Fee/Hr"
	}];

	$scope.shiftMonth = [{value: "01", label: "01"}, {value: "02", label: "02"}, {value: "03", label: "03"}, {value: "04", label: "04"}, {value: "05", label: "05"}, {value: "06", label: "06"}, {value: "07", label: "07"}, {value: "08", label: "08"}, {value: "09", label: "09"}, {value: "10", label: "10"}, {value: "11", label: "11"}, {value: "12", label: "12"}];

	$scope.shiftDate = [{value: "01", label: "01"}, {value: "02", label: "02"}, {value: "03", label: "03"}, {value: "04", label: "04"}, {value: "05", label: "05"}, {value: "06", label: "06"}, {value: "07", label: "07"}, {value: "08", label: "08"}, {value: "09", label: "09"}, {value: "10", label: "10"}, {value: "11", label: "11"}, {value: "12", label: "12"}, {value: "13", label: "13"}, {value: "14", label: "14"}, {value: "15", label: "15"}, {value: "16", label: "16"}, {value: "17", label: "17"}, {value: "18", label: "18"}, {value: "19", label: "19"}, {value: "20", label: "20"}, {value: "21", label: "21"}, {value: "22", label: "22"}, {value: "23", label: "23"}, {value: "24", label: "24"}, {value: "25", label: "25"}, {value: "26", label: "26"}, {value: "27", label: "27"}, {value: "28", label: "28"}, {value: "29", label: "29"}, {value: "30", label: "30"}, {value: "31", label: "31"}];

	$scope.shiftYear = [{value: "2016", label: "2016"}];
	
	$scope.post = function(month, date, year, startTimeHour, startTimeMin, shiftHour, shiftMin, jobPosition, address){

		var shiftDate = month.value + '/' + date.value + '/' + year.value;

		if (angular.isUndefined(jobPosition) || angular.isUndefined(month) || angular.isUndefined(date) || angular.isUndefined(year) || angular.isUndefined(startTimeHour) || angular.isUndefined(startTimeMin) || angular.isUndefined(shiftHour) || angular.isUndefined(shiftMin) || angular.isUndefined(address)) {
			$scope.errorMessage = "All fields are required.";
			$scope.error = true;
		} else if (!dateIsValid(shiftDate)) {
			$scope.error = true;
			$scope.errorMessage = "Invalid date."
		} else {
			$scope.error = false;
			var userInfo = hustleBeeAppFactory.getUserData();
			var userId = userInfo._id;
			var hourToMins = shiftHour.value * 60;
			var shiftDuration = hourToMins + shiftMin.value;
			var startTime = (startTimeHour.value*60)  + startTimeMin.value;
			var shiftAddress = userInfo.addresses[address.value];
			var shift = {};
			var pharmacistJobDescription = "The Pharmacist is responsible for ensuring proper drug distribution and control; assessing and ensuring rational and effective drug therapy according to patient age, weight, and disease state; communicating drug information to physicians, other health care professionals and patients; maintaining effective and efficient workflow and supervising ancillary staff.";

			var technicianJobDescription = "The Pharmacy Technician will prepare, package, document, and label drug products under the direct technical supervision of the Pharmacist.  Performs all required data entry and filing associated with the process and performs functions related to drug purchasing and inventory control procedures.  Technician will participate in the Pharmacy Department Performance Improvement projects/programs and collect data for workload measurements as needed or required."

			shift["date"] = shiftDate;
			shift["startTime"] = startTime;
			shift["duration"] = shiftDuration;
			shift["position"] = jobPosition.value;
			shift["employer"] = userId;
			shift["accepted"] = 0;
			shift["shiftAddress"] = shiftAddress;

			if (shift["position"] == "Outpatient Pharmacist") {
				shift["description"] = pharmacistJobDescription;
				shift["wage"] = "$65"
			}

			if (shift["position"] == "Inpatient Pharmacist") {
				shift["description"] = pharmacistJobDescription;
				shift["wage"] = "$70"
			}

			if (shift["position"] == "Pharmacy Technician") {
				
				shift["description"] = technicianJobDescription;
				shift["wage"] = "$30"
			}

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
	var auth = hustleBeeAppFactory.getUserStatus();

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
