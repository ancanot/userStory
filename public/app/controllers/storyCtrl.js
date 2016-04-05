angular.module('storyCtrl', ['storyService'])
	
	.controller('StoryController', function(Story, socketio) {

		var vm = this;

		Story.all()
			.success(function(data) {
				vm.stories = data;
			});

        vm.createStory = function() {
            vm.message = '';
            //ugharkvuma routes/api.js middleware-ic heto .post('/' ...), @ndegh save linum bazayum
            Story.create(vm.storyData)
            
                .success(function(data) {
                    
                    //create up the form
                    vm.storyData = {};
                    
                    vm.message = data.message;
                });
        };
    
        
        socketio.on('story', function(data) {
            vm.stories.push(data);
        });
	})
    
    //stories-@ galisa app.routes.js -i resolve-ic vorpes obj
    .controller('AllStoriesController', function(stories, socketio) {
        var vm = this;
    
        vm.stories = stories.data;

        socketio.on('story', function(data) {
            vm.stories.push(data);
        });
    })