var http = require('http'),
	cheerio = require('cheerio');

//function that sends an http request to an address that gives us the html on that page
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

//function that sends an http request to an address that gives us all the links on that page
function pageRequest(path,callback){
	//send the http request to get the html of that page
	sendRequest(path,function(err,body){
		if(err){
			callback(err);
		}
		else{
			var anchorArr = [];
			//scrape the html to get all the links
			var $ = cheerio.load(body);
			var arrObj = $('body').find('a'); //and object containing meta data about the DOM elements of the page
			//create an array of the links from the arrObj
			for(var elem in arrObj){
				if(!isNaN(parseInt(elem))){ //if the object key is a number (since there are other keys that are strings)
					var temp = arrObj[elem].attribs.href; 
					anchorArr.push(temp);
				}
			}
			//send out the anchorArr that contains all the links on the page
			callback(null,anchorArr);
		}
	});
}

module.exports ={
	anchorRequest : pageRequest,
	htmlRequest   : sendRequest
} 