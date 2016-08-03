hustleBeeAppModule.controller('AuthController', function($scope, $rootScope, $location, $state, $stateParams, userFactory, authFactory, hustleBeeAppFactory){

  $scope.credit = {};
  $scope.credit.check = false;
  $scope.error = false;
  $scope.disabled = true;

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

  $scope.creditCheck = function(){
    console.log('hi');
    if($scope.credit.check === false){
      $scope.credit.check === true;
    }
    else{
      $scope.credit.check === false;
    }
  };

  function stripeResponseHandler(status, response){
    if(response.error){
      console.log(response.error.message);
      $scope.error = true;
      $scope.errorMessage = response.error.message;
    }else{
      console.log(response.id)
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
    $scope.$apply();
  }


  $scope.registerBusiness = function(credit){
    $scope.error = false;
    var newUser, stateLicense;
    var token;
    userFactory.getTempInfo(function(output){
      newUser = output.newUser;
      stateLicense = output.license;
      if($scope.credit.check === true){
        token = Stripe.card.createToken({
          number: credit.number,
          cvc: credit.cvc,
          exp_month: credit.exp_month,
          exp_year: credit.exp_year,
          address_zip: credit.zip
        }, stripeResponseHandler);
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
    if(angular.isUndefined(newUser)){
      $scope.error = true;
      $scope.errorMessage = "All fields are required.";
    } else
      if (angular.isUndefined(newUser.firstName) || angular.isUndefined(newUser.lastName) || angular.isUndefined(newUser.companyName) || angular.isUndefined(newUser.email) || angular.isUndefined(newUser.password) || angular.isUndefined(newUser.phone) || angular.isUndefined(newUser.confirmPassword) || angular.isUndefined(newUser.licenseNumber) || angular.isUndefined(newUser.licenseExpirationDate) || angular.isUndefined(stateLicense.value)){
        $scope.error = true;
        $scope.errorMessage = "All fields are required.";
      } else if ((newUser.firstName === '') || (newUser.lastName === '') || (newUser.companyName === '') || (newUser.email === '') || (newUser.username === '') || (newUser.password === '') || (newUser.phone === '') || (newUser.confirmPassword === '')){
        $scope.error = true;
        $scope.errorMessage = "All fields are required.";
      } else if (newUser.password != newUser.confirmPassword) {
        $scope.error = true;
        $scope.errorMessage = "Passwords do not match."
      } else {
        newUser.status = 0;
        newUser.employer = true;
        newUser.stateLicense = stateLicense.value;
        userFactory.setTempInfo(newUser, stateLicense);
        $state.go('credit')
      }
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
