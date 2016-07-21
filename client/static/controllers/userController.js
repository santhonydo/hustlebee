hustleBeeAppModule.controller('UserController', function($scope, $rootScope, $uibModal, $location, $state, $stateParams, informationFactory, userFactory, authFactory, hustleBeeAppFactory){
  $scope.logout = function(){	
    $rootScope.loggedIn = false;	
    authFactory.logout(function(success){
      if(success){
        $state.go('userLogin');
      }
    })
  }

});

hustleBeeAppModule.controller('UserSettingsController', function($scope, $http, $rootScope, $uibModal, $location, $state, $stateParams, informationFactory, userFactory, authFactory, hustleBeeAppFactory){
  var userInfo = userFactory.getUserData();
  var auth = userFactory.getUserStatus();

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
    userFactory.getUpdatedUserData(userInfo._id, function(data){
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
      informationFactory.post(user, '/employeeUpdateUser', function(data){
        if(data){
          getUpdatedUserData();
          $scope.success = true;
          $scope.successMessage = data.msg;
        }
      })
    }
  }

});

hustleBeeAppModule.controller('UserMainController', function($scope, $rootScope, $uibModal, $location, $state, $stateParams, informationFactory, authFactory, userFactory, hustleBeeAppFactory){
  var user = userFactory.getUserData();
  var auth = userFactory.getUserStatus();
  if (auth === true && user.employer === false) {
    $scope.status = user.status;
    $rootScope.loggedIn = true;
  }
  else{
    $state.go('userLogin')
  }

  var getShifts = function(){
    informationFactory.post({userId : user._id}, '/getAvailableShifts', function(output){
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

    informationFactory.post(data, '/updateShift', function(data){
      getShifts();
    })
  }

  getShifts();

});


hustleBeeAppModule.controller('UserShiftController', function($scope, $rootScope, $uibModal, $location, $state, $stateParams, informationFactory, userFactory, authFactory, hustleBeeAppFactory){
  var user = userFactory.getUserData();
  var auth = userFactory.getUserStatus();
  if (auth === true && user.employer === false) {
    $scope.status = user.status;
    $rootScope.loggedIn = true;
  }
  else{
    $state.go('userLogin')
  }

  var getShifts = function(){
    informationFactory.post({userId: user._id}, 'getAvailableShifts', function(output){
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
    informationFactory.post(data, '/updateShift', function(data){
      getShifts();
    })
  }

  getShifts();

});
