var http = require('http'),
	async = require('async');

function sendRequest(id,callback){
	http.get('http://www.shirts4mike.com/shirt.php?id='+id,function(response){
		var body = '';
		if(response.statusCode !== 200){
			callback(new Error("No response from the server. Status code error of: " + response.statusCode));
		}
		response.on('data',function(chunk){
			body+=chunk;
		});
		if(response.statusCode ===200){
			response.on('end',function(){
				callback(null,body);
			});
		}
	}).on('error',function(err){
		callback(err);
	});
}
function complileData(callback){
	var data='';
	async.waterfall([
		function(cb){
			sendRequest('101',function(err,body){
				cb(null,body);
			});
		},
		function(body,cb){
			data+=body;
			sendRequest('102',function(err,body){
				cb(null,body);
			});
		},
		function(body,cb){
			data+=body;
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
			callback(null,data);
		}
		],
		function(err,results){
		if(err){
			console.log(err.stack);
		}
		else{
			callback(null,results);
		}
	});
}
module.exports = complileData;