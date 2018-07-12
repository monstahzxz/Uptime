var http2 = require('http2');

var server = http2.createServer();


server.on('stream',function(stream,headers){
	stream.respond({
		'status' : 200,
		'content-type' : 'text/html'
	});
	stream.end('<html></html><body><p>Hello world</p></body>')
});

server.listen(6000);
