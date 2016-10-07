var LinkArr = require('./homeLinkArray'),
	httpReq = require('./httpReq');
	each = require('async-each-series');

// a function that sends out a http request and gets back anchorArr (array filled with links to pages with 'shirts' or 'shirt' depending on the value of bool) and html ARRAY
function getHtml(path,bool,callback){
	LinkArr(path,bool,function(err,anchorArr){
		if(err){
			callback(err);
		}
		else{
			var html = [];
			//the npm module called async-each-series used to send http requests to each url in the anchor in a sequence
			each(anchorArr, function(el, next) {
			    httpReq.htmlRequest(el,function(err,body){
			    	html.push(body);
			    	next();
			    });
			}, function (err) {
				if(err){
					callback(err);
				}
			  //upon success, we pass an error of null and the html ARRAY containing all html from all shirt pages and the anchorArr
			  callback(null,html,anchorArr);
			});	
		}
	});
}


module.exports = getHtml;
