var tls = require('tls');
var fs = require('fs');
var path = require('path');


var outboundMessage = 'ping';

var options = {
	'ca' : '',
};



var client = tls.connect(options,6000,function(){
	client.write(outboundMessage);
});

client.on('data',function(inboundMessage){
	var messageString = inboundMessage.toString();
	console.log("I wrote " + outboundMessage + " and they said " + messageString);
	client.end();
});
