var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/12");
var Schema = mongoose.Schema;
var db = mongoose.connection;

var userSchema = new Schema({
						email: String,
						password: String,
						salt: String,
						username: String,
						validated: Boolean
						});	

						
var validationSchema = new Schema({
						email: String,
						validationCode: String
						});
var pageSchema = new Schema({
						title: String,
						school: String,
						document: String,
						featured: String,
						tags: [],
						});

var User = mongoose.model('User', userSchema);
var Validation = mongoose.model('Validation',validationSchema);
var Page = mongoose.model('Page', pageSchema);
function saveUser (Email)
	{
		var newUser = new User({ email: Email});
		console.log("saving user " + Email);
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
module.exports.Validation = Validation;