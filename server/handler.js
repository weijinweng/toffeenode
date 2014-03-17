var fs = require('fs');
var path = require('path');
var url = require('url');
var web = "./web";

//Frontpage handler
function front(req, res, pathname)
	{
		
		fs.readFile('./web/front.html',function(err, data){
			if(err)
			{
				error(req,res);
				return console.log("error locating front.html");
			}
			else
			{
				res.writeHead(200,{"Content-Type":"text/html"});
				res.end(data);
			}
		});
	}
//verify accouts
function verify(req, res, pathname)
	{
		fs.readFile('./web/signup.html',function(err,data){
			if(err)
			{
				error(req,res);
				return console.log("error location signup.html");
			}
			else
			{
				res.writeHead(200, {"Content-Type":"text/html"});
				res.end(data);
			}
		});
	}
//iforgot handler
function iforgot(req, res, pathname)
	{
		fs.readFile('./web/iforgot.html',function(err, data){
			if(err)
			{
				error(req,res);
				return console.log("error loading iforgot.html");
			}
			else
			{
				res.writeHead(200,{"Content-Type":"text/html"});
				res.end(data);
			}
		});
	}
//login handler
function login(req, res, pathname)
	{
		fs.readFile('./web/login.html', function(err, data){
			if(err)
			{
				error(req, res);
				return console.log("error location login.html");
			}
			else
			{
				res.writeHead(200,{"Content-Type":"text/html"});
				res.end(data);
			}
		});
	}
//Static files handler
function staticFile (req, res, pathname)
	{
		
		var ext = path.extname(pathname);
		
		switch(ext){
			case '.css':
				res.writeHead(200, {"Content-Type": "text/css"});
				fs.readFile(web+pathname, function(err, data){
										res.end(data);
				});
				break;
			case '.js':
				res.writeHead(200, {"Content-Type": "text/javascript"});
				fs.readFile(web+pathname, function(err, data){
										res.end(data);
				});
				break;
			default:
				fs.readFile(web+pathname, function(err, data){
				if(err)
				{
					error(req,res);
					return console.log("error locating " + web + pathname);
				}
				else
				{
					res.writeHead(200,{"Content-Type" : "text/plain"});
					res.end(data);
				}
				});
				break;

			}
	}
	
	
//404 handler
function error(req, res)
	{
		fs.readFile('./web/404.html', function(err, data){
				res.writeHead(404, {"Content-Type":"text/html"});
				if(err)
					{
					return	res.end("404 Error has occured");
					}
				else
					
					return res.end(data);
				});
	}
	

	module.exports.front = front;
	module.exports.error = error;
	module.exports.staticFile = staticFile;
	module.exports.login = login;
	module.exports.verify = verify;
	module.exports.iforgot = iforgot;