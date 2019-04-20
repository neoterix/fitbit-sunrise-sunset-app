# fitbit-sunrise-sunset-app
A small, hacked together Sunrise and Sunset times app for the Fitbit Versa.

### Fitbit App Gallery Description
>A simple app that provides today's sunrise and sunset times—handy if you want these times but already love your existing watchface.
>
>The app uses geolocation data from your Versa/Ionic to determine local sunrise and sunset times. The app supports the 12h/24h time format setting.
>
>Note that the first time the app is used, it may take up to two minutes to acquire geolocation data; please wait with the app open. After this, a copy of the most recently provided geolocation is cached locally on your watch to speed up subsequent use.
>
>PERMISSIONS:
>Only the geolocation permission is needed to calculate your personal sunrise/sunset times *locally* on your Fitbit. No Internet permissions are needed, no data is transmitted.
>
>DISCLAIMER: 
>I wrote this very quickly for exactly my needs. Credit to Matt Kane for the calculation library. Please see additional documentation and feel free to build on my simple code: https://github.com/neoterix/fitbit-sunrise-sunset-app/

### Additional Features/Notes
* The app respects the user setting on the 12h/24h time format
* One surprise during development was how long it took the app to receive geolocation data from the watch. It wasn't something that came up when using the Fitbit watch emulator, as the data came instantaneously. Imagine my surprise when I deployed the app to my watch and nothing showed up because the geolocation API was waiting for data. When I later timed it, it took over a minute (1:10) acquire.
* To improve the usability, I implemented a lightweight geolocation cache. After geolocation data comes in, it writes the latitude and longitude to an app file on the watch. Whenever the app is opened, the app checks for the file; if it's present, it will calculate sunrise/sunset times from the cached data and then seek a geolocation update. Once new geolocation data comes in, the file is overwritten. 
* The downside here is that if the user has moved significantly from the data was last cached, the sunrise/sunset times could be off or misleading, but I suspect that's a relatively narrow case.

### Resources/Credits
* A previous version of the app icon was cropped from Edson Perotoni's sunset photo found here: https://flic.kr/p/sg6zpq Thank you for dedicating the image to the public domain!
* The JS sunrise/sunset calculation library was created by Matt Kane (@ascorbic) and distributed under the GNU Lesser General Public License v2.1. The Github repo can be found here: https://github.com/Triggertrap/sun-js

> Written with [StackEdit](https://stackedit.io/).
