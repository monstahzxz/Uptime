var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');
var _data = require('./data');
var handlers = require('./handlers');
var helpers = require('./helpers');
var path = require('path');
var util = require('util');
var debug = util.debuglog('server');

var server = {};


server.httpServer = http.createServer(function(req,res){
	server.unifiedServer(req,res);
});



server.httpsServerOptions = {

};

server.httpsServer = https.createServer(server.httpsServerOptions,function(req,res){
	server.unifiedServer(req,res);
});



server.unifiedServer = function(req,res){
	var parsedUrl = url.parse(req.url,true);

	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');


	var method = req.method.toLowerCase();
	var queryStringObject = parsedUrl.query;
	var headers = req.headers;

	var decoder = new StringDecoder('utf-8');
	var buffer = '';
	req.on('data',function(data){
		buffer += decoder.write(data);
	});

	req.on('end',function(){
		buffer += decoder.end();
		var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
		
		chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

		var data = {
			'queryStringObject' : queryStringObject,
			'trimmedPath' : trimmedPath,
			'method' : method,
			'headers' : headers,
			'payload' : helpers.parseJsonToObject(buffer)
		};

		try{
			chosenHandler(data,function(statusCode,payload,contentType){
				server.processHandlerResponse(res,method,trimmedPath,statusCode,payload,contentType);
			});
		}catch(e){
			debug(e);
			server.processHandlerResponse(res,method,trimmedPath,500,{'Error' : 'An unknwon error has occured'},'json');
		}
		//debug("Requested path = " + trimmedPath);
		//debug("Method: " + method);
		//debug("Query object: ", queryStringObject);
		//debug("Headers: ", headers);
		
	});
};


server.processHandlerResponse = function(res,method,trimmedPath,statusCode,payload,contentType){
	contentType = typeof(contentType) == 'string' ? contentType : 'json';
	statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
	

			var payloadString = '';
			
			if(contentType == 'json'){
				res.setHeader('Content-Type','application/json');
				payload = typeof(payload) == 'object' ? payload : {};
				payloadString = JSON.stringify(payload);
			}

			if(contentType == 'html'){
				res.setHeader('Content-Type','text/html');
				payloadString = typeof(payload) == 'string' ? payload : '';
			}

			if(contentType == 'favicon'){
				res.setHeader('Content-Type','image/x-icon');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}

			if(contentType == 'css'){
				res.setHeader('Content-Type','text/css');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}

			if(contentType == 'png'){
				res.setHeader('Content-Type','image/png');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}

			if(contentType == 'jpeg'){
				res.setHeader('Content-Type','image/jpeg');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}

			if(contentType == 'plain'){
				res.setHeader('Content-Type','text/plain');
				payloadString = typeof(payload) !== 'undefined' ? payload : '';
			}


			res.writeHead(statusCode);
			res.end(payloadString);


			if(statusCode == 200){
				debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+'/'+trimmedPath+' '+statusCode);
			}
			else {
				debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+'/'+trimmedPath+' '+statusCode);
			}
};



server.router = {
	'' : handlers.index,
	'account/create' : handlers.accountCreate,
	'account/edit' : handlers.accountEdit,
	'account/deleted' : handlers.accountDeleted,
	'session/create' : handlers.sessionCreate,
	'session/deleted' : handlers.sessionDeleted,
	'checks/all' : handlers.checksList,
	'checks/create' : handlers.checksCreate,
	'checks/edit' : handlers.checksEdit,
	'ping' : handlers.ping,
	'api/users' : handlers.users,
	'api/tokens' : handlers.tokens,
	'api/checks' : handlers.checks,
	'favicon.ico' : handlers.favicon,
	'public' : handlers.public,
	'examples/error' : handlers.exampleError
};

server.init = function(){
	server.httpServer.listen(config.httpPort,function(){
		console.log('\x1b[36m%s\x1b[0m',"The server is now on " + config.httpPort + " in " + config.envName + " mode!");
	});

	server.httpsServer.listen(config.httpsPort,function(){
		console.log('\x1b[35m%s\x1b[0m',"The server is now on " + config.httpsPort + " in " + config.envName + " mode!");
	});
};


module.exports = server;	
