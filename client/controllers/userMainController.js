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
    console.log(user);
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

