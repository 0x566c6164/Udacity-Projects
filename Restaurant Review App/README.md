# Mobile Web Specialist Certification Course

## Restaurant Reviews App - what to expect?
*API's & Maps* </br>
*Responsive Design* </br>
*Accessibility & Semantics* </br>
*ServiceWorkers caching assets* </br>

## How to run?
Inside `js/dbhelper.js` configure your servers address and port with this function </br>
```JavaScript
static get DATABASE_URL() {
    const port = 3000 // Change this to your server port
    return 'http://127.0.0.1:${port}/data/restaurants.json';
  }
  ```
  
## Dependencies
MapBox v0.49.0 </br>
1.3.1 leaflet.js </br>
