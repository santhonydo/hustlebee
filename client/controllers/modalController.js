hustleBeeAppModule.controller('ModalController', function($scope, $rootScope, $state, $uibModalInstance, userFactory, informationFactory, hustleBeeAppFactory, uiGmapGoogleMapApi){

  $scope.error = false;
  $scope.success = false;
  $scope.creditCard = {};
  $scope.creditCard.exp_month = "00";
  $scope.creditCard.exp_year= "00";

  var userInfo = userFactory.getUserData();

  $scope.states = [{value: "CA", label: "CA"}];

  $scope.close = function() {
    console.log('bump');
    $uibModalInstance.dismiss('cancel');
    $rootScope.$broadcast('updateUser');
    $rootScope.$broadcast('updateCard');
  };

  function stripeResponseHandler(status, response){
    var data = {};
    if(response.error){
      $scope.error = true;
      $scope.errorMessage = response.error.message;
    }else{
      data.token = response.id;
      data.email = userInfo.email;
      informationFactory.post(data, 'addCard', function(results){
        if(results.msg === 'Saved successfully!'){
          $state.go('business.settings');
          $scope.error = false;
          $scope.success = true;
          $scope.successMessage = results.msg;
        } else {
          $scope.error = true;
          $scope.errorMessage = data[0];
          $scope.disabled = false;
        }
      })
    }
    $scope.$apply();
  }

  $scope.addCreditCard = function(creditCard){
    $scope.error = false;
    Stripe.card.createToken({
      number: creditCard.number,
      cvc: creditCard.cvc,
      exp_month: creditCard.exp_month,
      exp_year: creditCard.exp_year,
      address_zip: creditCard.zip
    }, stripeResponseHandler);
  }

  $scope.addAddress = function(address, state){
    if(angular.isUndefined(address)) {
      $scope.error = true;
      $scope.errorMessage = "All fields are required.";
    } else if(angular.isUndefined(address.street) || angular.isUndefined(address.street) || angular.isUndefined(address.city) || angular.isUndefined(address.zipcode) || angular.isUndefined(state)){

      $scope.error = true;
      $scope.success = false;
      $scope.errorMessage = "All fields are required.";
    } else {
      //address should be renamed
      var address = address;
      address.state = state.value;
      address.userId = userInfo._id;

      var geoCodeAddress = address.street + " " + address.city + " " + address.state + " " + address.zipcode;

      hustleBeeAppFactory.geoCode(geoCodeAddress, function(data){
        if (data.status == "OK") {
          $scope.error = false;
          $scope.errorMessage = "";
          address.coordinate = data.coordinate;

          informationFactory.post(address, '/addAddress', function(data){
            if(data){
              $scope.success = true;
              $scope.successMessage = "Address added successfully! Add another?";
              $rootScope.$broadcast('updateUser');
              $scope.address = {};
              $scope.state = {};
            }
          });
        } else {
          $scope.error = true;
          $scope.errorMessage = "Invalid address.";
          return;
        }
      });
    } 
  };
});
