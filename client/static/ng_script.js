var hustleBeeAppModule = angular.module('hustleBeeApp', ['ngRoute', 'ui.router', 'ui.bootstrap', 'ngMessages', 'stormpath','stormpath.templates', 'angulartics', 'angulartics.google.analytics', 'uiGmapgoogle-maps']);

hustleBeeAppModule.run(function ($state, $rootScope, hustleBeeAppFactory, $location) {
	$rootScope.$on('$stateChangeStart', function (event, to) {
		var auth = hustleBeeAppFactory;
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

	  .state('shifts', {
	    url: '',
	    templateUrl: '/static/partials/shifts/shiftsDashboard.html',
	    caseInsensitiveMatch: true,
	    controller: 'ShiftsController'
	  })

	  .state('shifts.main', {
	    url: '/shifts',
	    templateUrl: '/static/partials/shifts/shiftsMain.html',
	    caseInsensitiveMatch: true,
	    controller: 'ShiftsMainController'
	  })

	  .state('user', {
	    url: '',
	    templateUrl: '/static/partials/user/userDashboard.html',
	    caseInsensitiveMatch: true,
	    controller: 'UserController'
	  })

	  .state('user.login', {
	    url: '/employee/login',
	    templateUrl: '/static/partials/user/userLogin.html',
	    caseInsensitiveMatch: true,
	    controller: 'UserLoginController'
	  })

	  .state('user.register', {
	    url: '/employee/register',
	    templateUrl: '/static/partials/user/userRegister.html',
	    caseInsensitiveMatch: true,
	    controller: 'UserRegisterController'
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


		//Business Section

		.state('business', {
			url: '',
			templateUrl: '/static/partials/dashboard.html',
			caseInsensitiveMatch: true,
			controller: 'DashboardController'
		})

		.state('employerInfoPage', {
			url: '/business',
			templateUrl: '/static/partials/employerInfoPage.html',
			caseInsensitiveMatch: true,
			controller: 'EmployerInfoPageController'
		})

		.state('login', {
			url: '/business/login',
			templateUrl: '/static/partials/login.html',
			caseInsensitiveMatch: true,
			controller: 'AuthController'
		})

		.state('register', {
			url: '/business/register',
			templateUrl: '/static/partials/register.html',
			caseInsensitiveMatch: true,
			controller: 'AuthController'
		})

		.state('forgot', {
			url: '/business/forgot',
			templateUrl: '/static/partials/forgot.html',
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
			templateUrl: '/static/partials/resetPassword.html',
			caseInsensitiveMatch: true,
			controller: 'NewPasswordController'
		})

		.state('business.user', {
			url: '/business/user',
			templateUrl: '/static/partials/userBusinessHome.html',
			caseInsensitiveMatch: true,
			controller: 'UserHomePageController',
			data: {
				loggedInUser: true
			}
		})

		.state('business.postShift', {
			url: '/business/postShift',
			templateUrl: '/static/partials/postJob.html',
			caseInsensitiveMatch: true,
			controller: 'JobPostingController',
			data: {
				loggedInUser: true
			}
		})

		.state('business.settings', {
			url: '/business/settings',
			templateUrl: '/static/partials/settings.html',
			caseInsensitiveMatch: true,
			controller: 'SettingsController',
			data: {
				loggedInUser: true
			}
		})
});


