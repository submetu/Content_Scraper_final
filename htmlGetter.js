var http = require('http'),
	async = require('async');

//function that sends an http request to an address with the argument of 'id' and has a callback argument
function sendRequest(id,callback){
	http.get('http://www.shirts4mike.com/shirt.php?id='+id,function(response){
		var body = '';
		if(response.statusCode !== 200){ //if the server doesn't repsond
			callback(new Error("No response from the server. Status code error of: " + response.statusCode));
		}
		response.on('data',function(chunk){
			body+=chunk; // save the chunks gotten by the http response in a body variable
		});
		if(response.statusCode ===200){ //if the server responds
			response.on('end',function(){ //when the http response has ended
				callback(null,body); //when the http response is complete, invoke the callback with an error of null and an argument of body
			});
		}
	}).on('error',function(err){ //if something went wrong with the http request do this
		callback(err); //invoke the callback with an error
	});
}

function complileData(callback){
	var data='';
	//async.waterfall gets the callbacks in the array in a squential order. It handles errors in every callback at the end
	async.waterfall([
		function(cb){
			sendRequest('101',function(err,body){
				cb(null,body);
			});
		},
		function(body,cb){
			data+=body; //adds the html string to data
			sendRequest('102',function(err,body){
				cb(null,body);
			});
		},
		function(body,cb){
			data+=body; //adds the html string to data
			sendRequest('103',function(err,body){
				cb(null,body);
			});
		},
		function(body,cb){
			data+=body;
			sendRequest('104',function(err,body){
				cb(null,body);
			});
		},
		function(body,cb){
			data+=body;
			sendRequest('105',function(err,body){
				cb(null,body);
			});
		},
		function(body,cb){
			data+=body;
			sendRequest('106',function(err,body){
				cb(null,body);
			});
		},
		function(body,cb){
			data+=body;
			sendRequest('107',function(err,body){
				cb(null,body);
			});
		},
		function(body,cb){
			data+=body;
			sendRequest('108',function(err,body){
				cb(null,body);
			});
		},
		function(body,cb){
			data+=body;
			callback(null,data); //if there is no error along the way pass the total html string to the callback
		}
		],
		function(err,results){
		if(err){
			callback(err);
		}
		else{
			callback(null,results);
		}
	});
}
module.exports = complileData;