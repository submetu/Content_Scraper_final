var httpReq = require('./httpReq');
var url = 'http://www.shirts4mike.com/';
//This function gives us an array of links that have the word 'shirts' if bool is false or that have the word 'shirt' if bool is true
function test(path,bool,callback){
	httpReq.anchorRequest(path,function(err,anchorArr){
		if(err){
			callback(err);
		}
		else{
			//modifies anchor array to have links to items that only have the word 'shirt' in them
			anchorArr = anchorArr.filter(function(item,pos){
				return item.indexOf('shirt')!== -1;
			});
			// if bool is true then modify the anchor array once more to remove any links that have the word 'shirts' in them
			if(bool){
				anchorArr = anchorArr.filter(function(item,pos){
				return item.indexOf('shirts')=== -1;
				});
			}
			//adds the url before the anchorArr elements to make each element a proper url
			anchorArr= anchorArr.map(function(elem,index){
				return url + elem;
			});
			//send out the anchorArr that has elements that are complete urls
			callback(null,anchorArr);
		}
	});
}

module.exports = test;