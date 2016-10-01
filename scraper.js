var mkdirp = require('mkdirp'),
	csv    = require('fast-csv'),
	fs 	   = require('fs'),
	getMainArray = require('./scrapeCompiler'),
	schedule = require('node-schedule');;

//get the date right now
var date = new Date();
var dateData = date.getFullYear() + '-' + (date.getMonth() < 10 ? "0" : "") + date.getMonth() + '-' 
			   +  (date.getDate() < 10 ? "0" : "") + date.getDate() ;



//A node job scheduler that runs the scraper everyday at 00:00 hours
var j = schedule.scheduleJob({hour: 19, minute: 25}, function(){

	console.log('Shirt data saved for today!');
	// makes a directory 'data' if it doesn't exist and runs the callback function main.main
	mkdirp('./data',function main(err){
	if(err){
   		throw err.stack;
   }
   else{
   		getMainArray(function(err,mainArr){
			if(err){
				throw err.stack
			}
			else{
				var mainArrRemapped=[];
				var mainArrRemapped = mainArr[0].map(function(col, i) {
				    return mainArr.map(function(row) {
				        return row[i];
				    });
				});
				//creates a file with the today's date as a csv file inside the data folder
   				var ws = fs.createWriteStream('./data/'+dateData+'.csv');
				csv.write(mainArrRemapped,{quoteHeaders: true}).pipe(ws);
				
			}
			
		});
   }
});


});



