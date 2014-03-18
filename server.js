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

https.listen(8000);

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
		pathname = url.parse(req.url).pathname;
		//routes to handler
		route.router(req,res,pathname,handler, clients);
	}

	


io.sockets.on('connection', function (socket) {	
	console.log("Socket.id " + socket.id + " has connectes");
	var cookies = socket.handshake.headers['cookie'];
	if (cookies != null && cookies != "confirm=-1")
	{
		cookies = cookies.substring(cookies.indexOf('=')+1,cookies.length);
		console.log("The cookie " + cookies);
		clients[socket.id] = cookies;
		socket.emit("logged-in");
	}

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

					socket.emit("success");

					var validationcode = crypto.randomBytes(32).toString('base64');
					
					var code = new database.Validation({email:Email, validationCode: validationcode});
					
					code.save(function(){
					console.log("The email "+ code.email +" with " + code.validationCode + " has been saved");

					var mailOptions = {
						from:"toffeebot@gmail.com",
						to: Email,
						subject:"Hello,",
						text:'Here is your validation link: http://localhost:8000/verify?v='+validationcode,

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
					return console.log("Error " +err);
				} else {
				crypto.pbkdf2(Password, doc.salt, 10000, 512, function(err, derivedKey){
				if(err)
					{
						socket.emit('verification-failed');
						return console.log(error);
					}
				else if(doc.password == derivedKey)
					{
						console.log("Successful verification " + doc._id);
						socket.emit('verified', doc._id);
					}
				});
				}
			});
		});
	});
































