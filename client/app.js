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
			templateUrl: '/partials/userSelectionPage.html',
			caseInsensitiveMatch: true,
		})

		.state('home', {
			url: '/employee',
			templateUrl: '/partials/homepage.html',
			caseInsensitiveMatch: true,
			controller: 'HomepageController'
		})

	  .state('admin', {
	    url: '',
	    templateUrl: '/partials/admin/adminDashboard.html',
	    caseInsensitiveMatch: true,
	    controller: 'AdminController'
	  })

	  .state('adminLogin', {
	    url: '/admin',
	    templateUrl: '/partials/admin/adminLogin.html',
	    caseInsensitiveMatch: true,
	    controller: 'AdminLoginController'
	  })

	  .state('admin.main', {
	    url: '/admin/main',
	    templateUrl: '/partials/admin/adminMain.html',
	    caseInsensitiveMatch: true,
	    controller: 'AdminMainController'
	  })

	  .state('user', {
	    url: '',
	    templateUrl: '/partials/user/userDashboard.html',
	    caseInsensitiveMatch: true,
	    controller: 'UserController'
	  })

	  .state('userLogin', {
	    url: '/employee/login',
	    templateUrl: '/partials/user/userLogin.html',
	    caseInsensitiveMatch: true,
	    controller: 'AuthController'
	  })

	  .state('userRegister', {
	    url: '/employee/register',
	    templateUrl: '/partials/user/userRegister.html',
	    caseInsensitiveMatch: true,
	    controller: 'AuthController'
	  })
    
	  .state('user.main', {
      url: '/employee/user',
	    templateUrl: '/partials/user/userMain.html',
	    caseInsensitiveMatch: true,
	    controller: 'UserMainController'
	  })

	  .state('user.settings', {
      url: '/employee/settings',
	    templateUrl: '/partials/user/userSettings.html',
	    caseInsensitiveMatch: true,
	    controller: 'UserSettingsController'
	  })

	  .state('user.shifts', {
      url: '/employee/shifts',
	    templateUrl: '/partials/user/userShifts.html',
	    caseInsensitiveMatch: true,
	    controller: 'UserShiftController'
	  })

	  .state('user.indeed', {
      url: '/employee/indeed',
	    templateUrl: '/partials/user/indeed.html',
	    caseInsensitiveMatch: true,
	    controller: 'UserIndeedController'
	  })




		//Business Section

		.state('business', {
			url: '',
			templateUrl: '/partials/business/dashboard.html',
			caseInsensitiveMatch: true,
			controller: 'DashboardController'
		})

		.state('employerInfoPage', {
			url: '/business',
			templateUrl: '/partials/business/employerInfoPage.html',
			caseInsensitiveMatch: true,
			controller: 'EmployerInfoPageController'
		})

		.state('login', {
			url: '/business/login',
			templateUrl: '/partials/auth/login.html',
			caseInsensitiveMatch: true,
			controller: 'AuthController'
		})

		.state('register', {
			url: '/business/register',
			templateUrl: '/partials/auth/register.html',
			caseInsensitiveMatch: true,
			controller: 'AuthController'
		})

		.state('credit', {
			url: '/business/register/credit',
			templateUrl: '/partials/auth/credit.html',
			caseInsensitiveMatch: true,
			controller: 'AuthController'
		})

		.state('forgot', {
			url: '/business/forgot',
			templateUrl: '/partials/auth/forgot.html',
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
			templateUrl: '/partials/auth/resetPassword.html',
			caseInsensitiveMatch: true,
			controller: 'NewPasswordController'
		})

		.state('business.user', {
			url: '/business/user',
			templateUrl: '/partials/business/userBusinessHome.html',
			caseInsensitiveMatch: true,
			controller: 'UserHomePageController',
			data: {
				loggedInUser: true
			}
		})

		.state('business.postShift', {
			url: '/business/postShift',
			templateUrl: '/partials/business/postJob.html',
			caseInsensitiveMatch: true,
			controller: 'JobPostingController',
			data: {
				loggedInUser: true
			}
		})

		.state('business.settings', {
			url: '/business/settings',
			templateUrl: '/partials/business/settings.html',
			caseInsensitiveMatch: true,
			controller: 'SettingsController',
			data: {
				loggedInUser: true
			}
		})
});


