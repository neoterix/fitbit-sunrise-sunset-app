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

// I'm so sorry this is a terrible hack to import calculation library
console.log("Confirm Library Import: " + sunCalcLibrary());
sunCalcLibrary();

const sunriseTimeText = document.getElementById("sunriseTimeText");
const sunsetTimeText = document.getElementById("sunsetTimeText");

// If initially waiting for GPS, usability messaging
var gpswaitText = "Waiting for GPS Data";
sunriseTimeText.text = `${gpswaitText}`;
sunsetTimeText.text = `${gpswaitText}`;


// Function that checks for a particular file
import { listDirSync } from "fs";
function file_exists(filename) {
    let dirIter = "";
    let listDir = listDirSync("");
    while((dirIter = listDir.next()) && !dirIter.done) if(dirIter.value===filename) return true;
    return false;
}

// Check to see if GPS cache files are in place
if(file_exists("utf8_lat.txt")) {
  console.log("GPS cache file exists, using cache");
  let utf8_read_lat = parseFloat(fs.readFileSync("utf8_lat.txt", "utf-8"));
  let utf8_read_long = parseFloat(fs.readFileSync("utf8_long.txt", "utf-8"));
  let cacheSunriseTime = new Date().sunrise(utf8_read_lat, utf8_read_long);
  let cacheSunsetTime = new Date().sunset(utf8_read_lat, utf8_read_long);
  formatTime(cacheSunriseTime, cacheSunsetTime);
} else {
  console.log("GPS cache file does not exist");
}

// Abstracted time formatting code into its own function 
function formatTime(sunriseTime, sunsetTime) {
  let sunriseTimeHours = sunriseTime.getHours();
  let sunriseTimeMins = util.zeroPad(sunriseTime.getMinutes());
  let sunsetTimeHours = sunsetTime.getHours() % 12 || 12;
  let sunsetTimeMins = util.zeroPad(sunsetTime.getMinutes());
  //debugging
  //console.log("Sunrise:" + sunriseTime);
  //console.log("Sunset:" + sunsetTime);
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

// GeoLocation Function
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
  formatTime(gpsSunriseTime, gpsSunsetTime);
}
  
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
