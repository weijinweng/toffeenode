

function router(req, res, pathname, handler, clients)
	{
		console.log("request for " + pathname + " recieved");
		if (typeof handler[pathname] === 'function')
			{
				handler[pathname](req, res, clients);
			}
		else 
		{
			handler["static"](req, res, pathname);
		}
	}
	
module.exports.router = router;