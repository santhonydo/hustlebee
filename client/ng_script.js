var hustleBeeAppModule = angular.module('hustleBeeApp', ['ngRoute', 'ui.router', 'ui.bootstrap', 'ngMessages', 'stormpath','stormpath.templates', 'angulartics', 'angulartics.google.analytics', 'uiGmapgoogle-maps']);

hustleBeeAppModule.run(function ($state, $rootScope, userFactory, hustleBeeAppFactory, $location) {
	$rootScope.$on('$stateChangeStart', function (event, to) {
		var auth = userFactory;
		if((to.data && to.data.loggedInUser === true) && (auth.getUserStatus() === null || auth.getUserStatus() === false)){
			$state.go('login');
			event.preventDefault();
		}
	})
})

hustleBeeAppModule.directive('fileModel', ['$parse', function ($parse) {
return {
    restrict: 'A',
    link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
            scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
            });
        });
    }
};
}]);

hustleBeeAppModule.config(function($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider){

	uiGmapGoogleMapApiProvider.configure({
		key: 'AIzaSyD2n9kPrHgQmlZupGpnMpJhuffDFPx7GdE',
		v: '3.20',
		libraries: 'weather,geometry,visualization'
	});

	$urlRouterProvider.otherwise(function($injector, $location){
		var $state = $injector.get("$state");
		$state.go('initial');
	})

	$stateProvider

		.state('initial', {
			url: '',
			templateUrl: '/static/partials/userSelectionPage.html',
			caseInsensitiveMatch: true,
		})

		.state('home', {
			url: '/employee',
			templateUrl: '/static/partials/homepage.html',
			caseInsensitiveMatch: true,
			controller: 'HomepageController'
		})

	  .state('admin', {
	    url: '',
	    templateUrl: '/static/partials/admin/adminDashboard.html',
	    caseInsensitiveMatch: true,
	    controller: 'AdminController'
	  })

	  .state('adminLogin', {
	    url: '/admin',
	    templateUrl: '/static/partials/admin/adminLogin.html',
	    caseInsensitiveMatch: true,
	    controller: 'AdminLoginController'
	  })

	  .state('admin.main', {
	    url: '/admin/main',
	    templateUrl: '/static/partials/admin/adminMain.html',
	    caseInsensitiveMatch: true,
	    controller: 'AdminMainController'
	  })

	  .state('user', {
	    url: '',
	    templateUrl: '/static/partials/user/userDashboard.html',
	    caseInsensitiveMatch: true,
	    controller: 'UserController'
	  })

	  .state('userLogin', {
	    url: '/employee/login',
	    templateUrl: '/static/partials/user/userLogin.html',
	    caseInsensitiveMatch: true,
	    controller: 'AuthController'
	  })

	  .state('userRegister', {
	    url: '/employee/register',
	    templateUrl: '/static/partials/user/userRegister.html',
	    caseInsensitiveMatch: true,
	    controller: 'AuthController'
	  })
    
	  .state('user.main', {
      url: '/employee/user',
	    templateUrl: '/static/partials/user/userMain.html',
	    caseInsensitiveMatch: true,
	    controller: 'UserMainController'
	  })

	  .state('user.settings', {
      url: '/employee/settings',
	    templateUrl: '/static/partials/user/userSettings.html',
	    caseInsensitiveMatch: true,
	    controller: 'UserSettingsController'
	  })

	  .state('user.shifts', {
      url: '/employee/shifts',
	    templateUrl: '/static/partials/user/userShifts.html',
	    caseInsensitiveMatch: true,
	    controller: 'UserShiftController'
	  })



		//Business Section

		.state('business', {
			url: '',
			templateUrl: '/static/partials/business/dashboard.html',
			caseInsensitiveMatch: true,
			controller: 'DashboardController'
		})

		.state('employerInfoPage', {
			url: '/business',
			templateUrl: '/static/partials/business/employerInfoPage.html',
			caseInsensitiveMatch: true,
			controller: 'EmployerInfoPageController'
		})

		.state('login', {
			url: '/business/login',
			templateUrl: '/static/partials/auth/login.html',
			caseInsensitiveMatch: true,
			controller: 'AuthController'
		})

		.state('register', {
			url: '/business/register',
			templateUrl: '/static/partials/auth/register.html',
			caseInsensitiveMatch: true,
			controller: 'AuthController'
		})

		.state('credit', {
			url: '/business/register/credit',
			templateUrl: '/static/partials/auth/credit.html',
			caseInsensitiveMatch: true,
			controller: 'AuthController'
		})

		.state('forgot', {
			url: '/business/forgot',
			templateUrl: '/static/partials/auth/forgot.html',
			caseInsensitiveMatch: true,
			controller: 'ForgotPasswordController'
		})

		.state('reset', {
			url: '/business/reset/:id',
			caseInsensitiveMatch: true,
			controller: 'ResetPasswordController'
		})

		.state('resetPassword', {
			url: '/business/resetPassword',
			templateUrl: '/static/partials/auth/resetPassword.html',
			caseInsensitiveMatch: true,
			controller: 'NewPasswordController'
		})

		.state('business.user', {
			url: '/business/user',
			templateUrl: '/static/partials/business/userBusinessHome.html',
			caseInsensitiveMatch: true,
			controller: 'UserHomePageController',
			data: {
				loggedInUser: true
			}
		})

		.state('business.postShift', {
			url: '/business/postShift',
			templateUrl: '/static/partials/business/postJob.html',
			caseInsensitiveMatch: true,
			controller: 'JobPostingController',
			data: {
				loggedInUser: true
			}
		})

		.state('business.settings', {
			url: '/business/settings',
			templateUrl: '/static/partials/business/settings.html',
			caseInsensitiveMatch: true,
			controller: 'SettingsController',
			data: {
				loggedInUser: true
			}
		})
});


