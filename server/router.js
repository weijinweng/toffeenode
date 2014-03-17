

function router(req, res, pathname, handler)
	{
		console.log("request for " + pathname + " recieved");
		if (typeof handler[pathname] === 'function')
			{
				handler[pathname](req, res, pathname);
			}
		else 
		{
			handler["static"](req, res, pathname);
		}
	}
	
module.exports.router = router;