var helpers = require('./../lib/helpers');
var assert = require('assert');
var logs = require('./../lib/logs');
var exampleDebuggingProblem = require('./../lib/exampleDebuggingProblem');


var unit = {};


unit['helpers.getANumber should return a number'] = function(done){
	var val = helpers.getANumber();
	assert.equal(typeof(val),'number');
	done();
};

unit['helpers.getANumber should return 1'] = function(done){
	var val = helpers.getANumber();
	assert.equal(val,1);
	done();
};

unit['helpers.getANumber should return 2'] = function(done){
	var val = helpers.getANumber();
	assert.equal(val,2);
	done();
};


unit['logs.list should callback a false error and an array of log names'] = function(done){
	logs.list(true,function(err,logFileNames){
		assert.equal(err,false);
		assert.ok(logFileNames instanceof Array);
		assert.ok(logFileNames.length > 1);
		done();
	});
};

unit['logs.truncate should not throw if the logId doesnt exist. It should callback an error instead'] = function(done){
	assert.doesNotThrow(function(){
		logs.truncate('I do not exist',function(err){
			assert.ok(err);
			done();
		});
	},TypeError);
};

unit['exampleDebuggingProblem.init() should not throw'] = function(done){
	assert.doesNotThrow(function(){
		exampleDebuggingProblem.init();
		done();
	},TypeError);
};





module.exports = unit;
