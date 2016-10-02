var mkdirp = require('mkdirp'),
	csv    = require('fast-csv'),
	fs 	   = require('fs'),
	getMainArray = require('./scrapeCompiler'),
	schedule = require('node-schedule'),
	prompt   = require('./prompt.js');

//get the date right now
var date = new Date();
var dateData = date.getFullYear() + '-' + (date.getMonth() < 10 ? "0" : "") + date.getMonth() + '-' 
			   +  (date.getDate() < 10 ? "0" : "") + date.getDate();

console.log('Enter the hour and minute (in 24-hours) at which you want the scrape to happen everyday');
//the prompt function that takes a callback that gets the hours and minutes from the user at the start of the program
prompt(function(err,results){
	var hours = parseInt(results.hours);
	var minutes = parseInt(results.minutes);
	console.log("The scrape will now happen everyday at "+hours+":"+minutes+" hours.");
	//A node job scheduler that runs the scraper everyday at the user defined hours and minutes
	schedule.scheduleJob({hour: hours, minute: minutes}, function(){
	// makes a directory 'data' if it doesn't exist 
		mkdirp('./data',function main(err){
			if(err){
		   		throw err.stack;
		    }
		    else{
		   		getMainArray(function(err,mainArr){
					if(err){
						console.log(err);
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
						console.log("\nShirt data saved for today!");
					}
				});
		   	}
		});
	});

});





