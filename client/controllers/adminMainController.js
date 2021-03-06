hustleBeeAppModule.controller('AdminMainController', function($scope,  authFactory, userFactory,  $uibModal, $rootScope, $state, $stateParams, informationFactory, hustleBeeAppFactory){
  //PAGE AND VARIABLE SETUP///////////////////////////////////////////////////////
  //
  //filter set up
  $scope.filters = {
    employee: 'all',
    verified: 'all'
  }

  //filter attribute change
  $scope.changeEmployer = function(selection){
    $scope.filters.employee = selection;
    $scope.theFilter();
  }

  //filter attribute change
  $scope.changeVerified = function(selection){
    $scope.filters.verified = selection;
    $scope.theFilter();
  }

  //main filter function
  $scope.theFilter = function(){
    $scope.mainInfo = [];
    var theArray1 = [];
    var theArray2 = [];
    informationFactory.get('/getInfo', function(data){
      if($scope.filters.employee == 'employeeFilter'){
        for(var x in data){
          if(data[x].employer == false){
            theArray1.push(data[x]);
          }
        }
      }
      else if($scope.filters.employee == 'employerFilter'){
        for(var x in data){
          if(data[x].employer == true){
            theArray1.push(data[x]);
          }
        }
      }else{
        for(var x in data){
          theArray1.push(data[x]);
        }
      }
      if($scope.filters.verified == 'verified'){
        for(var x in theArray1){
          if(theArray1[x].status == 1){
            theArray2.push(theArray1[x]);
          }
        }
      }
      else if($scope.filters.verified == 'nonverified'){
        for(var x in theArray1){
          if(theArray1[x].status != 1){
            theArray2.push(theArray1[x]);
          }
        }
      }else{
        for(var x in theArray1){
          theArray2.push(theArray1[x]);
        }
      }
      if($scope.date.start != null && $scope.date.end != null){
        var date1, date2;
        date1 = Date.parse($scope.date.start);
        $scope.date.end.setDate($scope.date.end.getDate() + 1);
        date2 = Date.parse($scope.date.end);
        for(x in theArray2){
          var date3 = Date.parse(theArray2[x].date)
          if(date3 >= date1 && date3 <= date2){
            $scope.mainInfo.push(theArray2[x]);
          }
        }
      }
      else{
        for(x in theArray2){
          $scope.mainInfo.push(theArray2[x]);
        }
      }
    })
  }

  //alerts
  $scope.alerts = [];
  $scope.closeAlert = function(index){
    $scope.alerts.splice(index, 1);
  }

  var numDaysBetween = function(date1, date2){
    otherDate = Date.parse(date1);
    var diff = Math.abs(otherDate - date2.getTime());
    return diff / (1000 * 60 * 60 * 24);
  }

  var newDate = new Date()

  var getInfo = function(){
    informationFactory.get('getInfo', function(data){
      if(data){
        $scope.mainInfo = data;
      }
    });

    informationFactory.get('checkPictureUpdates', function(data){
      for(x in data.Contents){
        for(y in $scope.mainInfo){
          if($scope.mainInfo[y]._id == data.Contents[x].Key.slice(8)){
            $scope.mainInfo[y].date = new Date(data.Contents[x].LastModified).toString();
            if(numDaysBetween(data.Contents[x].LastModified, newDate) < 2 && $scope.mainInfo[y].status == 0){
              $scope.alerts.push({
                type: 'Update', msg: $scope.mainInfo[y].firstName + " " + $scope.mainInfo[y].lastName + " has added/modified their profile picture recently!"
              });
            }
          }
        }
      }
    })
  };
  //reload page if the series of modals closes
  $scope.$on("updatelist", function(){
    informationFactory.get('/getInfo', function(data){
      if(data){
        $scope.mainInfo = data;
      }
    });
  });

  //launches user info modal and passes information to it
  $scope.moreInfo = function(theinfo) {
    var modalInstance = $uibModal.open({
      animation: true,
      size: 'lg',
      templateUrl: '/partials/modals/userInfoModal.html',
      controller: 'InfoModalController',
      resolve: {
        info: function(){
          return theinfo;
        }
      }
    });
  };
  /////////Calender stuff/////////

  $scope.date = {
    start: null,
    end: null 
  }

  //PAGE AND VARIABLE SETUP ENDS//////////////////////////////////////////////////

  //authentication and retrieval of initial info
  userFactory.checkStatus();
  getInfo();
  if (userFactory.getUserStatus() === true) {
    $rootScope.loggedIn = true;
  } else {
    $rootScope.loggedIn = false;
  }
});
