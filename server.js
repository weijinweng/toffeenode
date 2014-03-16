var https = require('http');
var url = require('url');
var route = require('./server/router');
var handlers = require('./server/handler');



//handles urls
var handler = []
	handler["/"] = handlers.front;
	handler["/front"] = handlers.front;
	handler["static"] = handlers.staticFile;


function onRequest(req,res)
	{
		//get request url
		pathname = url.parse(req.url).pathname;
		//routes to handler
		route.router(req,res,pathname,handler);
	}


https.createServer(onRequest).listen(8000);

