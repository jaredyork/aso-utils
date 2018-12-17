var async = require('async');
var fs = require('fs');
var cron = require('node-schedule');

const gplay = require('aso')('gplay');
const itunes = require('aso')('itunes');

var keywords = [];

keywords = fs.readFileSync("dictionary.txt").toString().split('\n');

/*
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
];*/

var pathOutputITunes = "/var/www/html/archive-itunes.json";
var pathOutputGPlay = "/var/www/html/archive-gplay.json";
var pathOutputITunes = "/var/www/html/output-itunes.json";
var pathOutputGPlay = "/var/www/html/output-gplay.json";
var pathLogFile = "/var/www/html/log.txt";

var indexITunes = 0;
var arrDataITunes = [];

var indexGPlay = 0;
var arrDataGPlay = [];

// ITUNES
function gotoNextKeywordITunes() {
  if (indexITunes < keywords.length - 1) {

    if (indexITunes % 10 == 0) {
      dumpArrayOfJSONToFileITunes(false);
    }

    indexITunes++;
    asoRoutineITunes();
  }
  else {
    dumpArrayOfJSONToFileITunes(true);
  }
}

function dumpArrayOfJSONToFileITunes(dumpToArchive) {

  var outputString = JSON.stringify(arrDataITunes);

  fs.writeFile(pathOutputITunes, outputString, function(err, data) {
    if (err) {
      console.log("[iTunes] Failed to write keyword data to file. Reason: " + err);
    }

    console.log("[iTunes] The file was saved after adding data for keyword '" + keywords[indexITunes] + "'.");
    console.log("");

  });

  if (dumpToArchive) {
    fs.writeFile(pathOutputITunesArchive, outputString, function(err, data) {
      if (err) {
        console.log("[iTunes] Failed to write keyword data to archive. Reason: " + err);
      }

      fs.writeFile(pathLogFile, "[iTunes] Saved data array to output archive.", function(err, data) {
        if (err) {

        }
      });
  
    });
  }


}

function asoRoutineITunes() {

  console.log("[iTunes] Attempting to gather iTunes data for '" + keywords[indexITunes] + "'.");

  itunes.scores(keywords[indexITunes]).then(function(result) {

    result.keyword = keywords[indexITunes];
    arrDataITunes.push(result);

    console.log("[iTunes] data for '" + keywords[indexITunes] + "' gathered.");

    gotoNextKeywordITunes();

  }).catch(function(err) {
    console.log("[iTunes] ASO check failed for keyword '" + keywords[indexITunes] + "'. err=" + err + ". Skipping to next keyword.");

    gotoNextKeywordITunes();
  });
}


// GPLAY
function gotoNextKeywordGPlay() {
  if (indexGPlay < keywords.length - 1) {

    if (indexGPlay % 10 == 0) {
      dumpArrayOfJSONToFileGPlay(false);
    }

    indexGPlay++;
    asoRoutineGPlay();
  }
  else {
    dumpArrayOfJSONToFileGPlay(true);
  }
}

function dumpArrayOfJSONToFileGPlay(dumpToArchive) {

  var outputString = JSON.stringify(arrDataGPlay);

  fs.writeFile(pathOutputGPlay, outputString, function(err, data) {
    if (err) {
      console.log("[GPlay] Failed to write keyword data to file. Reason: " + err);
    }

    console.log("[GPlay] The file was saved after adding data for keyword '" + keywords[indexGPlay] + "'.");
    console.log("");

  });

  if (dumpToArchive) {
    fs.writeFile(pathOutputGPlayArchive, outputString, function(err, data) {
      if (err) {
        console.log("[GPlay] Failed to write keyword data to archive. Reason: " + err);
      }

      console.log("[GPlay] The archive was saved after adding data for keyword '" + keywords[indexGPlay] + "'.");
      console.log("");

      fs.writeFile(pathLogFile, "[GPlay] Saved data array to output archive.", function(err, data) {
        if (err) {

        }
      });

    });
  }

}

function asoRoutineGPlay() {

  //console.log("[GPlay] Attempting to gather GPlay data for '" + keywords[indexGPlay] + "'.");

  gplay.scores(keywords[indexGPlay]).then(function(result) {

    result.keyword = keywords[indexGPlay];
    arrDataGPlay.push(result);

    //console.log("[GPlay] data for '" + keywords[indexGPlay] + "' gathered.");

    gotoNextKeywordGPlay();

  }).catch(function(err) {
    //console.log("[GPlay] ASO check failed for keyword '" + keywords[indexGPlay] + "'. err=" + err + ". Skipping to next keyword.");

    gotoNextKeywordGPlay();
  });
}

function runAllAsoRoutinesInParallel() {

  console.log(new Date(), "ASO routines started.");
  indexITunes = 0;
  indexGPlay = 0;
  arrDataITunes.length = 0;
  arrDataGPlay.length = 0;

  async.parallel([
    asoRoutineITunes(),
    asoRoutineGPlay()
  ], function(err, results) {
    if (err) {
      console.error("An error occurred while attempting to run app in parallel: " + err);
    }

    console.log("The ASO routines have completed successfully.");
  });
}

function init() {
  indexITunes = 0;
  indexGPlay = 0;
  arrDataITunes.length = 0;
  arrDataGPlay.length = 0;

  runAllAsoRoutinesInParallel();

  var rule = new cron.RecurrenceRule();
  rule.hour = 24 * 7;
  var job = cron.scheduleJob(rule, function() {
    runAllAsoRoutinesInParallel();
  });
}

(function() {
  init();
})();