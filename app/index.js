import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { geolocation } from "geolocation";
import { sunCalcLibrary } from "./sun";
import * as fs from "fs";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const currentTime = document.getElementById("currentTime");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  let mins = util.zeroPad(today.getMinutes());
  if (preferences.clockDisplay === "12h") {
    // 12h format
    if (hours < 12) {
      let ampm;
      ampm = "AM";
      } else {
      ampm = "PM";
    }
    hours = hours % 12 || 12;
    currentTime.text = `${hours}:${mins} ${ampm}`;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
    currentTime.text = `${hours}:${mins}`;
  }
  
}


// Sunrise/Sunset Calculation and Geolocation Code

// I'm so sorry this is a terrible hack to import library
console.log("Confirm Library Import: " + sunCalcLibrary());
sunCalcLibrary();

const sunriseTimeText = document.getElementById("sunriseTimeText");
const sunsetTimeText = document.getElementById("sunsetTimeText");

// If initially waiting for GPS, usability messaging
var gpswaitText = "Waiting for GPS Data";
sunriseTimeText.text = `${gpswaitText}`;
sunsetTimeText.text = `${gpswaitText}`;


// Check to see if cache files are in place
import { listDirSync } from "fs";
function file_exists(filename) {
    let dirIter = "";
    let listDir = listDirSync("");
    while((dirIter = listDir.next()) && !dirIter.done) if(dirIter.value===filename) return true;
    return false;
}

if(file_exists("utf8_lat.txt")) {
  console.log("GPS cache file exists, using cache");
  let utf8_read_lat = parseFloat(fs.readFileSync("utf8_lat.txt", "utf-8"));
  let utf8_read_long = parseFloat(fs.readFileSync("utf8_long.txt", "utf-8"));
  let cacheSunriseTime = new Date().sunrise(utf8_read_lat, utf8_read_long);
  let cacheSunsetTime = new Date().sunset(utf8_read_lat, utf8_read_long);
  timeCalculation(cacheSunriseTime, cacheSunsetTime);
} else {
  console.log("GPS cache file does not exist");
}

//let file_stats = fs.existsSync("utf8_lat.txt");
/*
if (fs.access("utf8_lat.txt")) {
  let utf8_read_lat = parseFloat(fs.readFileSync("utf8_lat.txt", "utf-8"));
  let utf8_read_long = parseFloat(fs.readFileSync("utf8_long.txt", "utf-8"));
  let cacheSunriseTime = new Date().sunrise(utf8_read_lat, utf8_read_long);
  let cacheSunsetTime = new Date().sunset(utf8_read_lat, utf8_read_long);
  timeCalculation(cacheSunriseTime, cacheSunsetTime);
} else {
  geolocation.getCurrentPosition(locationSuccess, locationError, getCurrentPosition_geo_options);
}

import { existsSync } from "fs";
let chucktesta = existsSync("utf8_lat.txt");
console.log("Sunrise:" + chucktesta);
*/
//import { openSync } from "fs";
//openSync("utf8_lat.txt", "r");
//console.log("contents:" + fs.listDirSync(""))

/*
import { listDirSync } from "fs";
var listDir = listDirSync("/private/data");
var dirIter;
while((dirIter = listDir.next()) && !dirIter.done) {
console.log("directory: " + dirIter.value);
}
*/


function timeCalculation(sunriseTime, sunsetTime) {
  let sunriseTimeHours = sunriseTime.getHours();
  let sunriseTimeMins = util.zeroPad(sunriseTime.getMinutes());
  let sunsetTimeHours = sunsetTime.getHours() % 12 || 12;
  let sunsetTimeMins = util.zeroPad(sunsetTime.getMinutes());
  console.log("Sunrise:" + sunriseTime);
  console.log("Sunset:" + sunsetTime);
  if (preferences.clockDisplay === "12h") {
    sunriseTimeHours = sunriseTimeHours % 12 || 12;
    sunsetTimeHours = sunsetTimeHours % 12 || 12;
    sunriseTimeText.text = `${sunriseTimeHours}:${sunriseTimeMins} AM`;
    sunsetTimeText.text = `${sunsetTimeHours}:${sunsetTimeMins} PM`;
  } else {
    sunriseTimeHours = util.zeroPad(sunriseTimeHours);
    sunsetTimeHours = util.zeroPad(sunsetTimeHours);
    sunriseTimeText.text = `${sunriseTimeHours}:${sunriseTimeMins}`;
    sunsetTimeText.text = `${sunsetTimeHours}:${sunsetTimeMins}`;
  }
}



function locationSuccess(position) {
  //Caching new GPS coords for future access
  let utf8_lat = position.coords.latitude.toString();
  let utf8_long = position.coords.longitude.toString();
  fs.writeFileSync("utf8_lat.txt", utf8_lat, "utf-8");
  fs.writeFileSync("utf8_long.txt", utf8_long, "utf-8");
  //debugging
  //let utf8_read_lat = fs.readFileSync("utf8_lat.txt", "utf-8");
  //console.log("UTF-8 Lat Data: " + utf8_read_lat);
  //let utf8_read_long = fs.readFileSync("utf8_long.txt", "utf-8");
  //console.log("UTF-8 Long Data: " + utf8_read_long);
  let gpsSunriseTime = new Date().sunrise(position.coords.latitude, position.coords.longitude);
  let gpsSunsetTime = new Date().sunset(position.coords.latitude, position.coords.longitude);
  timeCalculation(gpsSunriseTime, gpsSunsetTime);
}
  
  /*
  //Sunrise
  var sunriseTime = new Date().sunrise(position.coords.latitude, position.coords.longitude);
  let sunriseTimeHours = sunriseTime.getHours();
  let sunriseTimeMins = util.zeroPad(sunriseTime.getMinutes());
  console.log("Sunrise:" + sunriseTime);
  if (preferences.clockDisplay === "12h") {
    sunriseTimeHours = sunriseTimeHours % 12 || 12;
    sunriseTimeText.text = `${sunriseTimeHours}:${sunriseTimeMins} AM`;
  } else {
    sunriseTimeHours = util.zeroPad(sunriseTimeHours);
    sunriseTimeText.text = `${sunriseTimeHours}:${sunriseTimeMins}`;
  }
  
  //Sunset
  var sunsetTime = new Date().sunset(position.coords.latitude, position.coords.longitude);
  let sunsetTimeHours = sunsetTime.getHours() % 12 || 12;
  let sunsetTimeMins = util.zeroPad(sunsetTime.getMinutes());
  console.log("Sunset:" + sunsetTime);
  if (preferences.clockDisplay === "12h") {
    sunsetTimeHours = sunsetTimeHours % 12 || 12;
    sunsetTimeText.text = `${sunsetTimeHours}:${sunsetTimeMins} PM`;
  } else {
    sunsetTimeHours = util.zeroPad(sunsetTimeHours);
    sunsetTimeText.text = `${sunsetTimeHours}:${sunsetTimeMins}`;
  }


*/

function locationError(error) {
  console.log("Error: " + error.code,
              "Message: " + error.message);
  let errorText = "No GPS, Try Again";
  sunriseTimeText.text = `${errorText}`;
  sunsetTimeText.text = `${errorText}`;
}

var geo_options = {
  enableHighAccuracy: false, 
  maximumAge        : 0, 
  timeout           : Infinity,
};

geolocation.getCurrentPosition(locationSuccess, locationError, geo_options);
