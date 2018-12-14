
const fs = require('fs');
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

    if (indexITunes % 50 == 0) {
      fs.writeFile(pathLogFile, "[iTunes] Finished 50 more. Amount finished=" + arrDataITunes.length + " - index=" + indexITunes, function(err, data) {
        if (err) {

        }

        dumpArrayOfJSONToFileITunes(false);
      });
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

  fs.exists(pathOutputITunes, function(exists) {
    if (exists) {
      fs.unlink(pathOutputITunes, function(err) {

        if(err && err.code == "ENOENT") {
          console.log("[iTunes] File doesn't exist, won't remove it.");
        }
        else if (err) {
          console.error("[iTunes] Error occured while trying to remove file.");
        }
        else {
          console.info("[iTunes] Removed JSON file.");

          fs.writeFile(pathOutputITunes, outputString, function(err, data) {
            if (err) {
              console.log("[iTunes] Failed to write keyword data to file. Reason: " + err);
            }

            console.log("[iTunes] The file was saved after adding data for keyword '" + keywords[indexITunes] + "'.");
            console.log("");
        
          }).then(fs.writeFile(pathLogFile, "[iTunes] Saved data array to output file.", function(err, data) {
            if (err) {

            }
          }));
        }

      });

    }
    else {
      
      fs.writeFile(pathOutputITunes, outputString, function(err, data) {
        if (err) {
          console.log("[iTunes] Failed to write keyword data to file. Reason: " + err);
        }

        console.log("[iTunes] The file was saved after adding data for keyword '" + keywords[indexITunes] + "'.");
    
      });
    }
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

    if (indexGPlay % 50 == 0) {
      fs.writeFile(pathLogFile, "[GPlay] Finished 50 more. Amount finished=" + arrDataGPlay.length + " - index=" + indexGPlay, function(err, data) {
        if (err) {

        }

        dumpArrayOfJSONToFileGPlay(false);
      });
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

  fs.exists(pathOutputGPlay, function(exists) {
    if (exists) {
      fs.unlink(pathOutputGPlay, function(err) {

        if(err && err.code == "ENOENT") {
          console.log("[GPlay] File doesn't exist, won't remove it.");
        }
        else if (err) {
          console.error("[GPlay] Error occured while trying to remove file.");
        }
        else {
          console.info("[GPlay] Removed JSON file.");

          fs.writeFile(pathOutputGPlay, outputString, function(err, data) {
            if (err) {
              console.log("[GPlay] Failed to write keyword data to file. Reason: " + err);
            }

            console.log("[GPlay] The file was saved after adding data for keyword '" + keywords[indexGPlay] + "'.");
            console.log("");

            fs.writeFile(pathLogFile, "[GPlay] Saved data array to output file.", function(err, data) {
              if (err) {

              }
            });
        
          });
        }

      });

    }
    else {
      
      fs.writeFile(pathOutputGPlay, outputString, function(err, data) {
        if (err) {
          console.log("[GPlay] Failed to write keyword data to file. Reason: " + err);
        }

        console.log("[GPlay] The file was saved after adding data for keyword '" + keywords[indexGPlay] + "'.");
    
      });
    }
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

    arrDataGPlay.push(result);

    //console.log("[GPlay] data for '" + keywords[indexGPlay] + "' gathered.");

    gotoNextKeywordGPlay();

  }).catch(function(err) {
    //console.log("[GPlay] ASO check failed for keyword '" + keywords[indexGPlay] + "'. err=" + err + ". Skipping to next keyword.");

    gotoNextKeywordGPlay();
  });
}


function init() {
  indexITunes = 0;
  indexGPlay = 0;

  console.log(new Date(), "Initial ASO routines started.");
  asoRoutineITunes();
  asoRoutineGPlay();

  var rule = new cron.RecurrenceRule();
  rule.hour = 24;
  var job = cron.scheduleJob(rule, function() {
    console.log(new Date(), "ASO routines started.");
    indexITunes = 0;
    indexGPlay = 0;
    arrDataITunes.length = 0;
    arrDataGPlay.length = 0;
    asoRoutineITunes();
    asoRoutineGPlay();
  });
}

(function() {
  init();
})();