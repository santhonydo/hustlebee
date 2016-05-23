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
	    templateUrl: '/static/partials/adminDashboard.html',
	    caseInsensitiveMatch: true,
	    controller: 'AdminController'
	  })

	  .state('adminLogin', {
	    url: '/admin',
	    templateUrl: '/static/partials/adminLogin.html',
	    caseInsensitiveMatch: true,
	    controller: 'AdminLoginController'
	  })

	  .state('admin.main', {
	    url: '/admin/main',
	    templateUrl: '/static/partials/adminMain.html',
	    caseInsensitiveMatch: true,
	    controller: 'AdminMainController'
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


