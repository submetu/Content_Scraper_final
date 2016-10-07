var httpReq = require('./httpReq'),
	LinkArr = require('./homeLinkArray'),
	htmlGetter = require('./htmlGetter'),
	isAShirt   = require('./isAShirt');
var multipleHtmlArr=[];
//function that gives us an array of html strings from all the pages
function getDuplicateHtmlArray(callback){
	isAShirt(function(err,singleShirtHtmlArr,multipleShirtsArr){
		// console.log(singleShirtHtmlArr);
		if(multipleShirtsArr.length > 0){
			for(var i =0;i<multipleShirtsArr.length;i++){
				//gives us the html with the bool true so it doesn't give us html of links that have "shirts" in them.
				htmlGetter(multipleShirtsArr[i],true,function(err,html,anchorArr){
					multipleHtmlArr.push(html);
					callback(null, multipleHtmlArr,singleShirtHtmlArr);
				});
			}
		}
	});
}
//a function that sends out a string of html of all the unique shirt links on the whole website
function getHtmlArray(callback){
	getDuplicateHtmlArray(function(err,multipleHtmlArr,singleShirtHtmlArr){
		if(err){
			callback(err);
		}
		else{
			//concatonate the singleShirtHtmlArr with the multipleHtmlArr[0] to mae one newArr
			var newArr = singleShirtHtmlArr.concat(multipleHtmlArr[0]);
			//filter out the duplicates in the newArr
			newArr = newArr.filter(function(item,pos){
				return newArr.indexOf(item) == pos;
			});
			//convert the array to a string and send out the string to scrapeCompiler.js
			callback(null,newArr.toString());
		}
		
	});
}

module.exports = getHtmlArray;
