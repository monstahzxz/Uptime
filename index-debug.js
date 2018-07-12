var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');
var exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');


var app = {};


app.init = function(){
	debugger;
	server.init();
	debugger;

	debugger;
	workers.init();
	debugger;

	debugger;
	setTimeout(function(){
		cli.init();
		debugger;
	},50);
	debugger;
	var foo = 1;
	console.log("Just assigned 1 to foo");
	debugger;
	foo++;
	console.log("Just incremented foo");
	debugger;
	foo = foo * foo;
	console.log("Just squared foo");
	debugger;
	foo = foo.toString();
	console.log("Just converted foo to string");
	debugger;
	exampleDebuggingProblem.init();
	console.log("Just called the library");
	debugger;
};

app.init();


module.exports = app;
