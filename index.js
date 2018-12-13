
const fs = require('fs');

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


function asoRoutine() {
  gplay.scores('asteroid').then(console.log);
  itunes.scores('asteroid').then(console.log);

  for (var i = 0; i < keywords.length; i++) {

    gplay.scores(keywords[i]).then(function(result) {
      var outputString = "\n";
      outputString += "RESULTS FOR '" + keywords[i] + "' on gplay.";
      outputString += result;
      outputString += "\n";

      console.log(outputString);

      fs.writeFile("/var/www/html/output.txt", outputString, function(err) {
        if (err) {
          console.log("Failed to write keyword data to file. Reason: " + err);
          continue;
        }

        console.log("The file was saved!");
      });
    });


  }
}

(function() {

  console.log(new Date(), "Initial ASO routine started.");
  asoRoutine();

  var cron = require('node-schedule');
  var rule = new cron.RecurrenceRule();
  rule.hour = 2;
  rule.minute = 0;
  cron.scheduleJob(rule, function() {
    console.log(new Date(), "ASO routine started.  Two hours has passed since the last routine.");

    asoRoutine();
  });

})();
