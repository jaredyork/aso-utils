
const fs = require('fs');
var cron = require('node-schedule');

const gplay = require('aso')('gplay');
const itunes = require('aso')('itunes');


var keywords = [
  "asteroid",
  "math",
  "space shooter",
  "math shooter",
  "education",
  "education game",
  "asteroid education",
  "education asteroid",
  "asteroid addition",
  "asteorid subtraction",
  "asteroid multiplication",
  "asteroid division",
  "education space",
  "education space game",
  "space game",
  "arithmetic",
  "arithmetic game",
  "education arithmetic",
  "math answer",
  "answer math",
  "answer addition",
  "answer subtraction",
  "answer multiplication",
  "answer division"
];

var index = 0;
var data = [];

function gotoNextKeyword() {
  if (index < keywords.length - 1) {
    index++;
    asoRoutine();
  }
  else {
    dumpArrayOfJSONToFile();
  }
}

function dumpArrayOfJSONToFile() {

  var outputString = JSON.stringify(data);

  fs.exists("/var/www/html/output.json", function(exists) {
    if (exists) {
      fs.unlink("/var/www/html/output.json", function(err) {

        if(err && err.code == "ENOENT") {
          console.log("File doesn't exist, won't remove it.");
        }
        else if (err) {
          console.error("Error occured while trying to remove file.");
        }
        else {
          console.info("Removed JSON file.");

          fs.writeFile("/var/www/html/output.json", outputString, function(err, data) {
            if (err) {
              console.log("Failed to write keyword data to file. Reason: " + err);
            }
        
          }).then(function(){
            console.log("The file was saved after adding data for keyword '" + keywords[index] + "'.");

            fs.writeFile("/var/www/html/log.txt", "Saved data array to output file.", function(err, data) {
              if (err) {

              }
            }).then(function() {

            }).catch(function(err) {

            });
        
            // Restart loop
            data.length = 0;
            index = 0;
            asoRoutine();
        
          }).catch(function(err) {
            console.log(err);

            fs.writeFile("/var/www/html/log.txt", "Failed to write data to output JSON. Error: " + err, function(err, data) {
              if (err) {

              }
            }).then(function() {

            }).catch(function(err) {

            });
        
            // Restart loop
            data.length = 0;
            index = 0;
            asoRoutine();
        
          });
        }

      });

    }
    else {
      
      fs.writeFile("/var/www/html/output.json", outputString, function(err, data) {
        if (err) {
          console.log("Failed to write keyword data to file. Reason: " + err);
        }
    
      }).then(function(){
        console.log("The file was saved after adding data for keyword '" + keywords[index] + "'.");
    
        // Restart loop
        data.length = 0;
        index = 0;
        asoRoutine();
    
      }).catch(function(err) {
        console.log(err);
    
        // Restart loop
        data.length = 0;
        index = 0;
        asoRoutine();
    
      });
    }
  });

}

function asoRoutine() {

  console.log("Attempting to gather iTunes data for '" + keywords[index] + "'.");

  itunes.scores(keywords[index]).then(function(result) {

    data.push(result);

    console.log("data for '" + keywords[index] + "' gathered.");

    gotoNextKeyword();

  }).catch(function(err) {
    console.log("ASO check failed for keyword '" + keywords[index] + "'. err=" + err + ". Skipping to next keyword.");

    gotoNextKeyword();
  });
}

(function() {

  index = 0;

  console.log(new Date(), "Initial ASO routine started.");
  asoRoutine();


})();
