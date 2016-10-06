/*
This fast-csv generator was used because a release occured about a week ago. The package is on its 2.3.0 release.It
had a total of 36 releases and over 62k downloads in the past month. There are only 37 issues open on github as compared
to the other csv generators which is very less. Also on its github page it has 26 contributors and 148 commits.
 */
/*
The scraper of cheerio was used because its syntax is very easy to use. With just one command (cheerio.load()), you can 
load the html to be scraped. After that, you can select specific elements on that html with jquery selectors i.e. css selectors.
 */


var mkdirp = require('mkdirp'),
	csv    = require('fast-csv'),
	fs 	   = require('fs'),
	getMainArray = require('./scrapeCompiler'),
	schedule = require('node-schedule'),
	prompt   = require('./prompt.js');

//get the date right now
var date = new Date();
var dateData = date.getFullYear() + '-' + (date.getMonth() < 10 ? "0" : "") + date.getMonth() + '-' +  (date.getDate() < 10 ? "0" : "") + date.getDate();

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
						console.log(err,"\n\nSomething went wrong, check your connection and try again");
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





