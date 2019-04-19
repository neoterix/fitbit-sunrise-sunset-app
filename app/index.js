import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { geolocation } from "geolocation";
import { sunCalcLibrary } from "./sun";

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

// I'm sorry this is a terrible hack
//console.log("Confirm Library Import: " + sunCalcLibrary());
sunCalcLibrary();

geolocation.getCurrentPosition(function(position) {
  
  //Sunrise
  const sunriseTimeText = document.getElementById("sunriseTimeText");
  var sunriseTime = new Date().sunrise(position.coords.latitude, position.coords.longitude);
  let sunriseTimeHours = sunriseTime.getHours();
  let sunriseTimeMins = util.zeroPad(sunriseTime.getMinutes());
  //console.log("Sunrise:" + sunriseTime);
  if (preferences.clockDisplay === "12h") {
    sunriseTimeHours = sunriseTimeHours % 12 || 12;
    sunriseTimeText.text = `${sunriseTimeHours}:${sunriseTimeMins} AM`;
  } else {
    sunriseTimeHours = util.zeroPad(sunriseTimeHours);
    sunriseTimeText.text = `${sunriseTimeHours}:${sunriseTimeMins}`;
  }
  
  //Sunset
  const sunsetTimeText = document.getElementById("sunsetTimeText");
  var sunsetTime = new Date().sunset(position.coords.latitude, position.coords.longitude);
  let sunsetTimeHours = sunsetTime.getHours() % 12 || 12;
  let sunsetTimeMins = util.zeroPad(sunsetTime.getMinutes());
  //console.log("Sunset:" + sunsetTime);
  if (preferences.clockDisplay === "12h") {
    sunsetTimeHours = sunsetTimeHours % 12 || 12;
    sunsetTimeText.text = `${sunsetTimeHours}:${sunsetTimeMins} PM`;
  } else {
    sunsetTimeHours = util.zeroPad(sunsetTimeHours);
    sunsetTimeText.text = `${sunsetTimeHours}:${sunsetTimeMins}`;
  }
});
