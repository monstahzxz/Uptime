var tls = require('tls');
var fs = require('fs');
var path = require('path');


var options = {
	'key' : '',
	'cert' : '',
};


var server = tls.createServer(options,function(connection){
	var outboundMessage = 'pong';
	connection.write(outboundMessage);

	connection.on('data',function(inboundMessage){
		var messageString = inboundMessage.toString();
		console.log("I wrote " + outboundMessage + " and they said " + messageString);
	});
});


server.listen(6000);
