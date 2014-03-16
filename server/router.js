

function router(req, res, pathname, handler)
	{
		console.log("request for " + pathname + " recieved");
		if (typeof handler[pathname] === 'function')
			{
				handler[pathname](req, res);
			}
		else 
		{
			//in case of error
			res.writeHead(404, {"Content-Type" : "text/html"});
			res.end("404 error");
		}
	}
	
module.exports.router = router;