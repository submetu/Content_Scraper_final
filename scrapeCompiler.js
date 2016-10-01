var cheerio = require('cheerio'),
	async   = require('async'),
	getData = require('./htmlGetter');

//a function to make the code more readable. This function is called in the getData() function later
function LoadData(data){
	//function that takes in a callback function that gives us the main array full of scraped data
	loadData(data,function(err,mainArr){
		if(err){
			console.log(err.stack);
		}
		else{
			return mainArr;
		}
	});
}
//function that prepares a main array filled with all the required scraped data
function loadData(data,callback){
	var mainArr   = [];
	var titleArr  = ['Title'];
	var priceArr  = ['Price'];
	var imgUrlArr = ['ImageUrl'];
	var urlArr 	  = ['URL'];
	var timeArr   = ['Time'];
	//the scraper module loading the html data of all the shirt pages
	var $ = cheerio.load(data);
	async.waterfall([
		function(cb){
			$('div.breadcrumb').each(function(){
				var title = $(this).text().replace('Shirts > ',"");
				titleArr.push(title);
			});
			cb(null,titleArr);
		},
		function(titleArr,cb){
			mainArr.push(titleArr);
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
				if(elem !== 'ImageUrl'){
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
				if(elem !== 'URL'){
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
			callback(null,mainArr);
		}
		],
		function(err,results){
		if(err){
			callback(err.stack);
		}
		else{
			callback(null,results)
		}
	});
}

/*  main invoking function that gets the html from htmlGetter.js invokes the loadData function to make mainArr 
	and checks for errors 
*/
function getMainArray(callback){
	getData(function(err,data){
		if(err){
			console.log(err.stack);
		}
		else{
			loadData(data,function(err,mainArr){
				if(err){
					callback(err);
				}
				else{
					callback(null,mainArr);
				}
			});
		}
	});
}


module.exports = getMainArray;

