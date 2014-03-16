var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/toffee");
var Schema = mongoose.Schema;
var db = mongoose.connection;

var userSchema = Schema({
						email: String,
						password: String,
						username: String,
						});		

						
var User = mongoose.model('User', userSchema);

function saveUser (Email, Pass, User)
	{
		var newUser = new User({ email: Email, password: Pass, username: User});
		console.log("saving user " + Email + Pass + User);
		newUser.save(function(err){
			if(err)
			{
				Console.log("Error has occured");
				return handleError(err);
			}
		});
	}
function findUser(Email)
	{
		var thisUser = User.find({ email: Email});
		console.log(thisUser.pass);
	}
	
module.exports.findUser = findUser;
module.exports.saveUser = saveUser;
module.exports.mongoose = mongoose;
module.exports.User = User;
