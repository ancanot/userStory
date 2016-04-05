angular.module('mainCtrl', [])
	//Auth is a factory from authService.js
	.controller('MainController', function($rootScope, $location, Auth) {
		var vm = this;

		vm.loggedIn = Auth.isLoggedIn();

		$rootScope.$on('$routeChangeStart', function() {

			vm.loggedIn = Auth.isLoggedIn();

			Auth.getUser()
				.then(function(data) {
					vm.user = data.data;
				});
		});


		vm.doLogin = function() {

			vm.proccessing = true;

			vm.error = '';

			Auth.login(vm.loginData.username, vm.loginData.password)
				.success(function(data) {
					vm.proccessing = false;

					Auth.getUser()
						// then-i datan kap chuni successi data het
						.then(function(data) {
							vm.user = data.data;
						});

					if(data.success) {
						$location.path('/');
					} else {
						vm.error = data.message;
					}	
				});
		};


		vm.doLogout = function() {
			Auth.logout();
			$location.path('/logout');
		}

	})