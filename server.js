var https = require('http').createServer(onRequest);
var url = require('url');
var route = require('./server/router');
var handlers = require('./server/handler');
var database = require('./server/database');
var io = require('socket.io').listen(https);
var nodemailer = require('nodemailer');
var crypto = require("crypto");
io.set('log level', 1);
//creates SMTP client to GMAIL toffeebot
var transport = nodemailer.createTransport("SMTP", {
				service: "Gmail",
				auth: {
					user: "toffeebot@gmail.com",
					pass: "caramelbitch"
					}
				});

https.listen(8080);


//email template
//transport.sendMail(mailOptions, function(error, response)
//			{
//				if(error){
//					console.log(error);
//				}else{
//					console.log("Message sent: " + response.message);
//				}
//			});

//clients container array
var clients = {};
//handles urls
var handler = []
	handler["/"] = handlers.front;
	handler["/front"] = handlers.front;
	handler["static"] = handlers.staticFile;
	handler["/login"] = handlers.login;
	handler["/verify"] = handlers.verify;
	handler["/iforgot"] = handlers.iforgot;
	handler["/error"] = handlers.error;
	handler["/almost-there"] = handlers.verified;
	handler["/logout"] = handlers.logout;
	handler["/home"] = handlers.home;

function onRequest(req,res)
	{
		//get request url
		var pathname = url.parse(req.url).pathname;
		//routes to handler
		route.router(req,res,pathname,handler, clients);
	}

	


io.sockets.on('connection', function (socket) {	
	console.log("Socket.id " + socket.id + " has connected");
	var cookies = socket.handshake.headers['cookie'];
	if (cookies != null && cookies != "confirm=-1")
	{
		cookies = cookies.substring(cookies.indexOf('=')+1,cookies.length);
		console.log("The cookie " + cookies);
		clients[socket.id] = cookies;
		socket.emit("logged-in");
	}
	socket.on('iforgot',function(Email){
		database.User.count({email:Email}, function(err, count)
		{
			if(err)
				return console.log(err);
			if(count == 0)
				return socket.emit('user_unknown');
			if(count == 1)
			{
					var validationcode = crypto.randomBytes(32).toString('base64');
					
					var code = new database.Validation({email:Email, validationCode: validationcode});
					
					code.save(function(){
					console.log("The email "+ code.email +" with " + code.validationCode + " has been saved");

					var mailOptions = {
						from:"toffeebot@gmail.com",
						to: Email,
						subject:"Hello,",
						text:'Here is your validation link: http://54.189.95.160/verify?v='+validationcode,

						}
						transport.sendMail(mailOptions, function(error, response)
						{

							if(error){
								console.log(error);
							}else{
								console.log("Message sent: " + response.message);
							}
						});
						socket.emit("successful-iforgot");

						});
			}
				
		});		
	});
	socket.on('signup-email', function(Email){
		var check = database.User.count({email:Email}, function(err, count){
			if(count== 0)
			{
				console.log("document doesnt exist");
				var newAcc = new database.User({email:Email,password:"not set", username:"not set", validated: false});
				newAcc.save(function(err){
					if(err)
						return console.log("an error has occured");
					console.log("User Signed up email is " + newAcc.email);

					var validationcode = crypto.randomBytes(32).toString('base64');
					
					var code = new database.Validation({email:Email, validationCode: validationcode});
					
					code.save(function(){
					console.log("The email "+ code.email +" with " + code.validationCode + " has been saved");

					var mailOptions = {
						from:"toffeebot@gmail.com",
						to: Email,
						subject:"Hello,",
						text:'Here is your validation link: http://54.186.95.160/verify?v='+validationcode,

						}
						transport.sendMail(mailOptions, function(error, response)
						{

							if(error){
								console.log(error);
							}else{
								console.log("Message sent: " + response.message);
							}
						});
						socket.emit("signedup");

						});
						socket.emit("success");

					});

			}
			else 
			{
				console.log("this exists");
				socket.emit("duplicate");
			}
		});
	});
	socket.on('verify', function(data){
		console.log("recieved " + data);
		var code = data.toString('base64');
		database.Validation.findOne({validationCode: code}, function(err, newData){
			if(err || newData == null)
			{
				console.log(err);
				return socket.emit('error-validation');
			}
			else
			{
				console.log(" Email is " + newData.email);
				socket.emit('validation-email', newData.email);
			}
			});
	});
	socket.on('finish-signup',function(Email, Password, Username){
				console.log("The email " + Email);
				var Salt = crypto.randomBytes(128).toString('base64');
				crypto.pbkdf2(Password, Salt, 10000, 512, function(err, derivedKey){
					database.User.findOne({email:Email},function(err, doc)
					{
						if(err||doc == null)
						{
							console.log(Email);
							return console.log("Error writing");
						}
						
						doc.password = derivedKey;
						doc.salt = Salt;
						doc.username = Username;
						doc.validated = true;
						console.log ( doc.password, doc.salt, doc.username);
						doc.save(function(err, product, changedcount)
						{
							console.log("The product salt is "+ product);
							database.Validation.findOneAndRemove({email: Email}, function(err){
								if(err)
									console.log(err);
								console.log("verification completed");
								socket.emit('verification-completed');
							});
						});
					});
				});
			});
	socket.on('login', function(Email, Password){
		database.User.findOne({email: Email}, function(err, doc)
			{
				console.log("Hello the email is " + Email);
				if(err||doc==null||doc.validated == false)
				{
					socket.emit('notverified');
					return console.log("Error " +err);
				} else {
				crypto.pbkdf2(Password, doc.salt, 10000, 512, function(err, derivedKey){
				if(err)
					{
						socket.emit('verification-failed');
						return console.log("error");
					}
				else if(doc.password == derivedKey)
					{
						console.log("Successful verification " + doc._id);
						socket.emit('verified', doc._id);
					}
				else 
					{
						socket.emit('verification-failed');
						console.log("Error");
					}
				
				});
				}
			});
		});
	
	socket.on('newest', function()
			{
				console.log("Requestion for pages received");
				database.Page.find({}, function(err, doc)
					{
						doc.forEach(function(entry){
							console.log("Sending " + entry.title);
							socket.emit('post-newest', entry.title, entry.school, entry.description);
						});
					});
			});
	//bookmarking
	socket.on('newpage',function(Title, School, Description, Document){
			var newPage = new database.Page({
								title: Title,
								school: School,
								description: Description,
								document: Document
								});
			newPage.save(function(){
						console.log(newPage.title + newPage.school + newPage.document + " has been saved");
			});
		});
	//bookmarking
	socket.on('bookmark-this', function(Title){
			var clientId = new database.ObjectID(clients[socket.id]);
			console.log('client ID = ' + clientId);
			database.User.findById(clientId,function(err, docs)
				{
					console.log("bookmarking for " + docs.email);
					if(err|| docs == null)
					{
						socket.emit("bookmark-no");
						return console.log("error with bookmarking");
					}
					else
					{
						console.log(docs._id);
						docs.following.push(Title);
						console.log("added bookmark " + docs.following);
						docs.save(function(){
						console.log("bookmark saved");
							socket.emit("bookmark-yes", Title);
							
						});
					}
				});
		});
	socket.on('bookmark-status', function(Title)
				{
				var clientId = new database.ObjectID(clients[socket.id]);
				console.log('client ID = ' + clientId);
				database.User.findById(clientId, function(err, data){
						if(err||data==null)
							return console.log("error");
						var followed = data.following;
						console.log("Following " + data.following);
						console.log(Title);
						if (followed.indexOf(Title) != -1)
							{
								socket.emit('bookmark-yes', Title);
								console.log("yes");
							}
						else
							{
								socket.emit('bookmark-no', Title);
								console.log("no");
							}				
					});
				});
	socket.on('unfollow', function(Title)
	{
		var clientId = new database.ObjectID(clients[socket.id]);
		console.log('client ID = ' + clientId);
		database.User.findById(clientId, function(err, docs){
		if(err||docs == null)
		{
			socket.emit("unfollow-failed");
			return console.log("error with unfollowing");
		}
		else
		{
			console.log(docs._id_);
			docs.following.splice(docs.following.indexOf(Title),1);
			console.log('now following '+ docs.following);
			docs.save(function()
				{
					console.log("unfollowed " + Title);
					socket.emit("bookmark-no", Title);
				});
		}
		});
		
	});
	socket.on('page-request', function(Title)
				{
					database.Page.findOne({title:Title},function(err, doc)
						{
							if(err || doc==null)
								{
									socket.emit('page-load-error');
									return console.log('error loading '+ Title);
								}
							else
								{
									console.log("serving page " + Title);
									socket.emit('page-response',doc.title,doc.school, doc.description, doc.document,doc.tags);
								}
						});
				});
	socket.on('edit', function(Title, Document)
	{
		database.Page.findOne({title:Title}, function(err, docs)
			{
				if(err||docs==null)
				{
					socket.emit("error-edit");
					return console.log("error editing");
				}
				else
				{
					docs.document = Document;
					docs.save(function(err){
					if(err) return console.log("Error");
						console.log("Edit succeeded");
						socket.emit("edit-yes");
					});
				}
			});
	});
});
































