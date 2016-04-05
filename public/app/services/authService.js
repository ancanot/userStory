angular.module('authService', [])

	.factory('Auth', function($http, $q, AuthToken) {

		var authFactory = {};

		//Ashxateluya /login -i jamanak, formic tvyalnern ugharki backend
		authFactory.login = function(username, password) {
			return $http.post('/api/login', {
				username: username,
				password: password
			})
			//promise functon, api.js -um login -ic heto steghcac token@
			// ugharkvuma res.json() -ov;
			.success(function(data) {
				AuthToken.setToken(data.token);
				return data;
			});
		};

		// api.js /api/logout -i jamanak, jnjuma token-@
		authFactory.logout = function() {
			AuthToken.setToken();
		};


		authFactory.isLoggedIn = function () {
			if(AuthToken.getToken())
				return true;
			else
				return false;
		};


		//User information, token-i sarqvelu jamanak User-i infona
		authFactory.getUser = function() {
			if(AuthToken.getToken())
				return $http.get('/api/me');
			else
				return $q.reject({ message: "User has no token!" });
		};

		return authFactory;		
	})


	//Continuing Create AuthToken Factory
	.factory('AuthToken', function($window) {
		var authTokenFactory = {};

		authTokenFactory.getToken = function() {
			return $window.localStorage.getItem('token');
		};

		authTokenFactory.setToken = function(token) {
			if(token)
				$window.localStorage.setItem('token', token);
			else
				$window.localStorage.removeItem('token');
		};

		return authTokenFactory;
	})

	//Continuing Create AuthInterceptor(перехватчик) Factory, used in app.js as config
	.factory('AuthInterceptor', function($q, $location, AuthToken) {
		var interceptorFactory = {};

		//For all requests check token
		interceptorFactory.request = function(config) {
			var token = AuthToken.getToken();

			if(token) {
				config.headers['x-access-token'] = token;
			}

			return config;
		};


		interceptorFactory.responseError = function(response) {
			if(response.status == 403) {
				$location.path('/login');
			}

			return $q.reject(response);
		}

		return interceptorFactory;
	})
