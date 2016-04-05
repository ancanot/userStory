angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'storyService', 'storyCtrl', 'reverseDirective'])

	.config(function($httpProvider) {
		//Used authService.js factory 
		$httpProvider.interceptors.push('AuthInterceptor');
	})