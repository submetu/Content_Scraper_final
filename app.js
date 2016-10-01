var cheerio = require('cheerio'),
	async   = require('async'),
	getData = require('./test.js');

function LoadData(data){
	loadData(data,function(err,mainArr){
		if(err){
			console.log(err.stack);
		}
		else{
			console.log(mainArr);
		}
	});
}
function loadData(data,callback){
	var mainArr = [];
	var titleArr = [];
	var priceArr = [];
	var imgUrlArr = [];
	var urlArr = [];
	var timeArr = [];
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
				elem = elem.replace('img/shirts/shirt-','');
				elem = parseInt(elem,10);
				var url = 'http://www.shirts4mike.com/shirt.php?id='+elem;
				urlArr.push(url);
			});
			cb(null,urlArr);
		},
		function(urlArr,cb){
			mainArr.push(urlArr);
			urlArr.forEach(function(elem){
				var date = new Date();
				var timeData = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear() + ' ' 
								+ date.getHours() + ':' + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes() 
								+ ':' + date.getSeconds();
				timeArr.push(timeData);
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

getData(function(err,data){
	if(err){
		console.log(err.stack);
	}
	else{
		LoadData(data);
	}
});

