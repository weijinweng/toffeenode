var https = require('http').createServer(onRequest);
var url = require('url');
var route = require('./server/router');
var handlers = require('./server/handler');
var database = require('./server/database');
var io = require('socket.io').listen(https);
var nodemailer = require('nodemailer');
var crypto = require("crypto");
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


var clients = {};
//handles urls
var handler = []
	handler["/"] = handlers.front;
	handler["/front"] = handlers.front;
	handler["static"] = handlers.staticFile;
	handler["/login"] = handlers.login;
	handler["/verify"] = handlers.verify;
	handler["/iforgot"] = handlers.iforgot;


function onRequest(req,res)
	{
		//get request url
		pathname = url.parse(req.url).pathname;
		//routes to handler
		route.router(req,res,pathname,handler);
	}




io.sockets.on('connection', function (socket) {	
	socket.on('signup', function(Email){
		var check = database.User.count({email:Email}, function(err, count){
			if(count== 0)
			{
				console.log("document doesnt exist");
				var newAcc = new database.User({email:Email,password:"not set", username:"not set", validated: false});
				newAcc.save(function(err){
					if(err)
						return console.log("an error has occured");
					console.log("User Signed up");

					socket.emit("success");

					var validationcode = crypto.randomBytes(64).toString('base64');
					
					var code = new database.Validation({email:Email, validationCode: validationcode});
					
					code.save(function(){
					

					var mailOptions = {
						from:"toffeebot@gmail.com",
						to: Email,
						subject:"Hello,",
						text:"Here is your validation link: ",
						html:'<a href="http://localhost:8000/verify?v='+validationcode+'" ></a>',
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

								if(error){
									console.log(error);
								}else{
									console.log("Message sent: " + response.message);
								}
							});
						socket.emit("signedup");

					});

			}
			else 
			{
				console.log("this exists");
				socket.emit("duplicate");
			}
		});
	});
});