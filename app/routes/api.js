var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');

//This is a private function for this module
function createToken(user) {
	var token = jsonwebtoken.sign({
		id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expiresInMinute: 1440
	});

	return token;
}


module.exports = function(app, express, io) {
	var api = express.Router();

    //get all Stories
    api.get('/all_stories', function(req, res) {
        Story.find({}, function(err, stories) {
            if(err) {
                res.send(err);
                return;
            }
            res.json(stories);
        });
    });
    
    
	//Signup, save 
	api.post('/signup', function(req, res) {
		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});

		var token = createToken(user);

		user.save(function(err) {
			if(err) {
				res.send(err);
				return;
			}

			res.json({ 
				success: true,
				message: 'User has been created!',
				token: token
			});
		});

	});

	//Get all users
	api.get('/users', function(req, res) {
		User.find({}, function(err, users) {
			if(err) {
				res.send(err);
				return;
			}

			res.json(users);
		});
	});


	api.post('/login', function(req, res) {
		User.findOne({ 
			username: req.body.username
		}).select('name username password').exec(function(err, user) {

			if(err) throw err;

			if(!user) {
				res.send({ message: "User doesn't exist!"});
			} else if(user) {
				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.send({ message: "Invalid Login OR Password!" });
				} else {

					var token = createToken(user);

					res.json({
						success: true,
						message: "Successfuly Login!",
						token: token
					});
				}
			}
		});
	});


	//Building Custom Middleware
	api.use(function(req, res, next) {

		console.log("Somebody just came to our app!");

		//Checked how token will came, with POST, GET or HEADERS
		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		//check if token exist
		if(token) {
			jsonwebtoken.verify(token, secretKey, function(err, decoded) {
				if(err) {
					res.status(403).send({ success: false, message: "Failed to authenticate user!" });
				} else {
					req.decoded = decoded;
					next();
				}
			});
		} else {
			res.status(403).send({ success: false, message: "No Token Provided!" });
		}
	});

	//AFTER MIDDLEWARE WRITED CODES SHOULD BE WORK!

	// api.get('/', function(req, res) {
	// 	res.json("Hello world!");
	// });

	//Middleware-ic heto ete petqa url poxvi
	api.route('/')
		//ete POST zaprosova linelu(loginic heto)
        //storyCtrl-ic galisa stegh
		.post(function(req, res) {
			var story = new Story({
				//token sarqeluc trvuma parametrer@ te inchna petq(nayel .sign() jamanak)
				// isk token-i verify jamanak bolor et param-@ linuma
				creator: req.decoded.id,
				content: req.body.content
			});

			story.save(function(err, newStory) {
				if(err) {
					res.send(err);
					return;
				}
                //ugharkuma Angular
                io.emit('story', newStory);
				res.json({ message: "New Story Created!" });
			});
		})

		//ete GET zaprosna linum Home-i vra(nshvac route-um)
		.get(function(req, res) {
			Story.find({ creator: req.decoded.id }, function(err, stories) {
				if(err) {
					res.send(err);
					return;
				}

				res.json(stories);
			});
		});


	//Send decoded data to frontend for AngularJS
	api.get('/me', function(req, res) {
		res.json(req.decoded);
	});


	//If we return api, url must be domain/api/signup
	return api;
}
