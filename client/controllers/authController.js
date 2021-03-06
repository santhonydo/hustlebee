hustleBeeAppModule.controller('AuthController', function($scope, $rootScope, $location, $state, $stateParams, userFactory, regChecker, authFactory, hustleBeeAppFactory){

  $scope.credit = {};
  $scope.credit.check = false;
  $scope.error = false;
  $scope.disabled = true;
  $scope.tempUserInfo = {};
  $scope.creditCard = {};
  $scope.creditCard.exp_month = "00";
  $scope.creditCard.exp_year = "00";


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
    {value: "Wyoming", label: "Wyoming"}
  ];

  function stripeResponseHandler(status, response){
    if(response.error){
      $scope.error = true;
      $scope.errorMessage = response.error.message;
    }else{
      $scope.tempUserInfo.token = response.id;
      authFactory.register($scope.tempUserInfo, function(data, results){
        if(data.username){
          userFactory.setUser(results, data)
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
    $scope.$apply();
  }


  $scope.registerBusiness = function(creditCard){
    $scope.error = false;
    var newUser, stateLicense;
    var token;
    userFactory.getTempInfo(function(output){
      newUser = output.newUser;
      $scope.tempUserInfo = output.newUser;
      if($scope.credit.check === true){
        Stripe.card.createToken({
          number: creditCard.number,
          cvc: creditCard.cvc,
          exp_month: creditCard.exp_month,
          exp_year: creditCard.exp_year,
          address_zip: creditCard.zip
        }, stripeResponseHandler);
      }
      else{
        authFactory.register(newUser, function(data, results){
          if(data.username){
            userFactory.setUser(results, data)
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
    });
  }

  $scope.login = function(user, info){
    authFactory.login(user, function(data, results){
      if(data.username){
        userFactory.setUser(results, data);
        if(info === 'business'){
          $state.go('business.user');
        }
        else if(info === 'user'){
          $state.go('user.main')
        }
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

  $scope.nextPage= function(newUser, stateLicense){
    var results;
    if(angular.isUndefined(newUser)){
      $scope.error = true;
      $scope.errorMessage = "All fields are required.";
    } 
    regChecker.userCheck(newUser, stateLicense, function(output){
      if(output.status === true){
        $scope.error = false;
        $scope.errorMessage  = '';
        newUser.status = 0;
        newUser.employer = true;
        newUser.stateLicense = stateLicense.value;
        userFactory.setTempInfo(newUser, stateLicense);
        $state.go('credit')
      }
      else{
        $scope.error = true;
        $scope.errorMessage  = output.message;
      }
    });
  }


  $scope.registerUser = function(newUser, occupation, stateLicense) {
    if(angular.isUndefined(newUser) || angular.isUndefined(occupation) || angular.isUndefined(stateLicense)){
      $scope.success = null;
      $scope.error = "Opps! Did you forget to enter all your information correctly?";
    } else if(angular.isUndefined(newUser.firstName) || angular.isUndefined(occupation.value) || angular.isUndefined(stateLicense.value) || angular.isUndefined(newUser.lastName) || angular.isUndefined(newUser.email) || angular.isUndefined(newUser.password) || angular.isUndefined(newUser.confirmPassword) || angular.isUndefined(newUser.zipcode) || angular.isUndefined(newUser.phoneNumber) || angular.isUndefined(newUser.licenseNumber) || angular.isUndefined(newUser.licenseExpirationDate)) {
      $scope.success = null;
      $scope.error = "Opps! Did you forget to enter all your information correctly?";
    } else {
      newUser.occupation = occupation.value;
      newUser.stateLicense = stateLicense.value;
      newUser.employer = false;
      authFactory.register(newUser, function(data, results){
        if(data.username){
          userFactory.setUser(results, data)
          $state.go('user.main');
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

  $scope.registerPage = function(){
    $state.go('userRegister')
  }

  $scope.register = function(){
    $state.go('register');
  }

  $scope.backToLogin = function() {
    $state.go('login');
  }

  $scope.backToUserLogin = function() {
    $state.go('userLogin');
  }
})
