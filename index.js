
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

function gotoNextKeyword() {
  if (index < keywords.length) {
    index++;
    asoRoutine();
  }
}

function asoRoutine() {

  gplay.scores(keywords[index]).then(function(result) {
    var outputString = JSON.stringify(result);

    console.log("data for '" + keywords[index] + "' gathered.");

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
  }).catch(function(err) {
    console.log("ASO check failed. err=" + err);

    gotoNextKeyword();
  });

}

(function() {

  index = 0;

  console.log(new Date(), "Initial ASO routine started.");
  asoRoutine();

  var rule = new cron.RecurrenceRule();
  rule.hour = 2;
  rule.minute = 0;
  cron.scheduleJob(rule, function() {
    console.log(new Date(), "ASO routine started.  Two hours has passed since the last routine.");

    index = 0;
    asoRoutine();
  });

})();
