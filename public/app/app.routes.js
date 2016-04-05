//ngRoute angulari service-nerica
angular.module('appRoutes', ['ngRoute'])
	//priver-i config@, voric heto nor sksuma providern ashxatel
	.config(function($routeProvider, $locationProvider) {
		$routeProvider
			//Erb home-i vraya
			.when('/', {
				templateUrl: 'app/views/pages/home.html',
				controller: 'MainController',
				controllerAs: 'main'
			})
			.when('/login', {
				templateUrl: 'app/views/pages/login.html'
			})
			.when('/signup', {
				templateUrl: 'app/views/pages/signup.html'
			})
            .when('/allStories', {
                templateUrl: 'app/views/pages/allStories.html',
                controller: 'AllStoriesController',
                controllerAs: 'story',
                //chi spasum datan gan nor render ani, ayl miangamic, galis-anuma
                resolve: {
                    //Story-n storyService-ica, stories-@ gnuma storyCtrl, vorpes func param
                    stories: function(Story) {
                        return Story.allStories();
                    }
                }
            })

		//Angularum arka # (hash) miacnuma
		$locationProvider.html5Mode(true);
	})