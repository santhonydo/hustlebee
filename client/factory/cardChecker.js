hustleBeeAppModule.factory('cardChecker', function($q, $timeout, $location, $http){
  factory = {};

  factory.checkCard = function(creditCard, callback){
    Stripe.card.validateCardNumber(creditCard.number);
    Stripe.card.validateExpirationDate(creditCard.number);
  }
  return factory;
})
