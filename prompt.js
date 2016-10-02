 var prompt = require('prompt');
 
 function startPrompt(callback){
	 prompt.start();
	 prompt.get(['hours', 'minutes'], function(err, result) {
		if(err){
			callback(err);
		}
		else{
			callback(null,result);
		}
		
	});
 }
 module.exports = startPrompt;
 