var mkdirp = require('mkdirp'),
	csv    = require('fast-csv'),
	fs 	   = require('fs'),
	getMainArray = require('./scrapeCompiler');

var date = new Date();
var dateData =date.getFullYear() + '-' + (date.getMonth() < 10 ? "0" : "") + date.getMonth() + '-' 
			  +  (date.getDate() < 10 ? "0" : "") + date.getDate() ;

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
   				var ws = fs.createWriteStream('./data/s'+dateData+'.csv');
				csv.write(mainArrRemapped,{headers:true,quoteHeaders: true}).pipe(ws);
				
			}
			
		});
   }
});


