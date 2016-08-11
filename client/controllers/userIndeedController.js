hustleBeeAppModule.controller('UserIndeedController', function($scope, $rootScope, $state, informationFactory, $stateParams){
  console.log('hi');

  informationFactory.get('http://api.indeed.com/ads/apisearch?publisher=8425930875543111&q=java&l=austin%2C+tx&sort=&radius=&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2&format=json', function(output){
    console.log(output);
  })
});
