var fs = require('fs');


function front(req, res)
	{
		
		fs.readFile('./web/front.html',function(err, data){
			if(err)
			{
				error(req,res);
				return console.log("error");
			}
			else
			{
				res.writeHead(200,{"Content-Type":"text/html"});
				res.end(data);
			}
		});

		
	}
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