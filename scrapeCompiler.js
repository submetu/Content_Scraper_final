var cheerio = require('cheerio'),
	async   = require('async'),
	getData = require('./htmlGetter');


//function that prepares a main array filled with all the required scraped data
function loadData(data,callback){
	var mainArr   = [];
	//intermediate arrays with first element as it will be the column header in the CSV file
	var titleArr  = ['Title'];
	var priceArr  = ['Price'];
	var imgUrlArr = ['ImageUrl'];
	var urlArr 	  = ['URL'];
	var timeArr   = ['Time'];
	//the scraper module loading the html data of all the shirt pages
	var $ = cheerio.load(data);
	async.waterfall([
		function(cb){
			$('div.breadcrumb').each(function(){ //finds the title html markup 
				var title = $(this).text().replace('Shirts > ',"");
				titleArr.push(title); //loads the titles in a titleArr
			});
			cb(null,titleArr); //passes an error of null and a titleArr array in the next function
		},
		function(titleArr,cb){
			mainArr.push(titleArr); //pushes the tilteArr array into the mainArr array
			$('span.price').each(function(){
				var price = $(this).text();
				priceArr.push(price);
			});
			cb(null,priceArr);
		},
		function(priceArr,cb){
			mainArr.push(priceArr);
			$('.shirt-picture img').each(function(){
				var imgUrl = $(this).attr('src');
				imgUrlArr.push(imgUrl);
			});
			cb(null,imgUrlArr);
		},
		function(imgUrlArr,cb){
			mainArr.push(imgUrlArr);
			imgUrlArr.forEach(function(elem){
				if(elem !== 'ImageUrl'){ //since the first item in the imgUrlArr is 'ImageUrl', we dont want to iterate over that element
					elem = elem.replace('img/shirts/shirt-','');
					elem = parseInt(elem,10);
					var url = 'http://www.shirts4mike.com/shirt.php?id='+elem;
					urlArr.push(url);
				}
			});
			cb(null,urlArr);
		},
		function(urlArr,cb){
			mainArr.push(urlArr);
			urlArr.forEach(function(elem){ 
				if(elem !== 'URL'){ //since the first item in the urlArr is 'URL, we dont want to iterate over that element
					var date = new Date();
					var timeData =  date.getFullYear()
									+ '-' + (date.getMonth() < 10 ? "0" : "") + date.getMonth() 
									+ '-' + (date.getDate() < 10 ? "0" : "") + date.getDate() + ' ' 
									+ date.getHours() + ':' + (date.getMinutes() < 10 ? "0" : "") 
									+ date.getMinutes() 
									+ ':' + (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
					timeArr.push(timeData);
				}
				
			});
			cb(null,timeArr);
		},
		function(timeArr,cb){
			mainArr.push(timeArr);
			callback(null,mainArr); //if theres no error till here, the callback is passed an error of null and an array of mainArr
		}
		],
	//if there was an error along the way 
	function(err,results){
		if(err){
			callback(err);//if there was an error along the way the callback is passed the error
		}
		else{
			callback(null,results);//if there was no error along the way the callback is passed the results and an error of null
		}
	});
}
//a function to make the code more readable. This function is called in the getData() function below
function LoadData(data,callback){
	//function that takes in a callback function that gives us the main array full of scraped data
	loadData(data,function(err,mainArr){
		if(err){
			callback(err);
		}
		else{
			callback(null,mainArr);
		}
	});
}
/*  main invoking function that gets the html from htmlGetter.js invokes the loadData function to make mainArr 
	and checks for errors 
*/
function getMainArray(callback){
	//the callback function that gets the html string data from htmlGetter.js
	getData(function(err,data){
		if(err){
			callback(err);
		}
		else{
			LoadData(data,callback);
		}
	});
}


module.exports = getMainArray;

