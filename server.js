var https = require('http');
var url = require('url');


function onRequest(req,res)
	{
		pathname = url.parse(req.url).pathname;
		
		res.writeHead(200,{"Content-Type":"text/plain"});
		res.end("Hello");
		
	}


https.createServer(onRequest).listen(8000);

