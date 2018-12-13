
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
  if (index < keywords.length) {
    index++;
    asoRoutine();
  }
  else {
    dumpArrayOfJSONToFile();
  }
}

function dumpArrayOfJSONToFile() {

  var outputString = JSON.stringify(data);

  fs.writeFile("/var/www/html/output.json", outputString, function(err, data) {
    if (err) {
      console.log("Failed to write keyword data to file. Reason: " + err);
    }

  }).then(function( ){
    console.log("The file was saved after adding data for keyword '" + keywords[index] + "'.");

    gotoNextKeyword();
  }).catch(function(err) {
    console.log(err);

    gotoNextKeyword();
  });

}

function asoRoutine() {

  console.log("Attempting to gather data for '" + keywords[index] + "'.");

  var gplayRequest = gplay.scores(keywords[index]);

  gplayRequest.then(function(result) {

    data.push(result);

    console.log("data for '" + keywords[index] + "' gathered.");

    gotoNextKeyword();

  }).catch(function(err) {
    console.log("ASO check failed for keyword '" + keywords[index] + "'. err=" + err + ". Skipping to next keyword.");

    gotoNextKeyword();
  });

  return gplayRequest;
}

(function() {

  index = 0;

  console.log(new Date(), "Initial ASO routine started.");
  asoRoutine();


})();
