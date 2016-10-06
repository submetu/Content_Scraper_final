var http = require('http'),
	cheerio = require('cheerio'),
	each = require('async-each-series');

//function that sends an http request to an address  and has a callback argument
function sendRequest(path,callback){
	http.get(path,function(response){
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
//gets all the shirt urls and saves them into an array
function getShirtUrls(callback){
	var shirtUrlArray = [];
	//the http request to the page where there are all the shirts
	sendRequest('http://www.shirts4mike.com/shirts.php',function(err,body){
		if(err){
			//if there was an error just send an error to the callback
			callback(err);
		}
		else{
			//loads the scraper
			var $ = cheerio.load(body);
			//gets all the anchor tags' href attributes and pushes them into the shirtUrlArray
			$('ul.products a').each(function(){
				var path = 'http://www.shirts4mike.com/'+$(this).attr('href');
				shirtUrlArray.push(path);
			});
			//no error and the array passed to the callback upon success
			callback(null,shirtUrlArray);
		}
	});
}



//the compile function that sends http requests to the shirt urls gotten from the getShirtUrls function. 
//This function puts all the html from the shirt pages into a variable called html
function compile(callback){
	getShirtUrls(function(err,shirtUrlArray){
	if(err){
		callback(err.stack);
	}
	else{
		var html = '';
		//the npm module called async-each-series used to send http requests to each url in the shirtUrlArray in a sequence
		each(shirtUrlArray, function(el, next) {
		    sendRequest(el,function(err,file){
		    	html+=file;
		    	next();
		    });
		}, function (err) {
			if(err){
				callback(err);
			}
		  //upon success, we pass an error of null and the html string containing all html from all shirt pages 
		  callback(null,html);
		});	
	}
});
}

module.exports = compile;