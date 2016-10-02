/*
IN ORDER TO CHECK THE PROGRAM, CHANGE THE "hour" and "minute" VALUES (on line 23) TO A SUITABLE TIME FOR YOU. THEN RUN THE PROGRAM.
THE SCRAPE WILL HAPPEN EVERYDAY AT THE CHOSEN "hour" and "minute".
 */


var mkdirp = require('mkdirp'),
	csv    = require('fast-csv'),
	fs 	   = require('fs'),
	getMainArray = require('./scrapeCompiler'),
	schedule = require('node-schedule');;

//get the date right now
var date = new Date();
var dateData = date.getFullYear() + '-' + (date.getMonth() < 10 ? "0" : "") + date.getMonth() + '-' 
			   +  (date.getDate() < 10 ? "0" : "") + date.getDate();

// A log for the user to know what to do if they are starting the scraper.js program without editing the time values on line 23
console.log(
"If you are running the program for the first time without opening scraper.js file then you should cancel this session and edit the line 23 of scraper.js. The 'hour' and the 'minute' value should be chosen according to your local time in order to test the program. The program will run everyday at the chosen time.");

//A node job scheduler that runs the scraper everyday at 00:00 hours
	schedule.scheduleJob({hour: 21, minute: 21}, function(){

	console.log("\nShirt data saved for today!");
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
					//REMAPS THE mainArr SUCH THAT IT IS COMPATIBLE WITH fast-csv MODULE (EXCHANGE ROWS WITH COLUMNS)
	  		        mainArrRemapped = mainArr[0].map(function(col, i) {
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



