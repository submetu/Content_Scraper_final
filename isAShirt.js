var htmlGetter = require('./htmlGetter'),
	cheerio    = require('cheerio');
// a function that determines if the links in anchorArr are giving us one shirt of more shirts
function LinkArrayGenerator(callback){
	var singleShirtHtmlArr = [];
	var multipleShirtsLinkArr = [];
	//function that gives us html and and all the links on the homepage of the website
	htmlGetter('http://www.shirts4mike.com',false,function(err,html,anchorArr){
		if(err){
			callback(err);
		}
		else{
			//iterate over the html ARRAY of all pages
			for(var i = 0; i<html.length; i++){
				var $ = cheerio.load(html[i]);
				//check if the html array element give us a page for one shirt or not
				var tempHtml = $('body').find('div.shirt-details').html();
				//if it gives us a page for one shirt
				if(tempHtml){
					singleShirtHtmlArr.push(html[i]);
				}
				//if it gives us a page with multiple shirts
				else{
					multipleShirtsLinkArr.push(anchorArr[i]);
					
				}
			}
			//remove duplicates from the array (multopleShirtsLinkArr) with links that lead to more shirts.
			multipleShirtsLinkArr = multipleShirtsLinkArr.filter(function(item,pos){
				return multipleShirtsLinkArr.indexOf(item) == pos;
			});
			callback(null,singleShirtHtmlArr,multipleShirtsLinkArr);
		}
	});
}

module.exports = LinkArrayGenerator;
