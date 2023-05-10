let map;
let rounds = 5;
let score = 0;
let activeRound;
let gameEnded = false;

//locations for the game
const locations = [
  { name: "Baseball Field", coords: { lat: 34.2447, lng: -118.526382 } },
  { name: "Sequoia Hall", coords: { lat: 34.240407, lng: -118.527927 } },
  { name: "Student Recreation Center", coords: { lat: 34.239977, lng: -118.524889 } },
  { name: "Tennis Courts", coords: { lat: 34.244150, lng: -118.524019 } },
  { name: "University Hall", coords: { lat: 34.239760, lng: -118.532150 } },
];

//Map API and parameters
async function initMap() {
  const { Map, LatLngBounds, Rectangle } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: { lat: 34.242573, lng: -118.529456 },
    zoom: 16,
    mapTypeId: 'satellite',
    draggable: false,
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    disableTilt: true,
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }
    ]
  });

//timer
  map.addListener("dblclick", (e) => {
    if (!startTime) {
      startTime = new Date().getTime();
      setInterval(updateTimer, 1000);
    }

    //Incorrect / Correct checker
    if (activeRound) {
      let isCorrect = false;
      if (e.latLng.lat() > activeRound.coords.lat - 0.001 && e.latLng.lat() < activeRound.coords.lat + 0.001 &&
          e.latLng.lng() > activeRound.coords.lng - 0.001 && e.latLng.lng() < activeRound.coords.lng + 0.001) {
        document.getElementById("feedback").textContent = "Correct!";
        score++;
        isCorrect = true;
      } else {
        document.getElementById("feedback").textContent = "Wrong!";
      }
  
      //rectangles red and green
      const rectangle = new Rectangle({
        strokeColor: isCorrect ? "#008000" : "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: isCorrect ? "#008000" : "#FF0000",
        fillOpacity: 0.35,
        map,
        bounds:{
        north: activeRound.coords.lat + 0.001,
        south: activeRound.coords.lat - 0.001,
        east: activeRound.coords.lng + 0.001,
        west: activeRound.coords.lng - 0.001,
      },
      });
  
      //Ending the game
      rounds = rounds - 1;
      if (rounds > 0) {
        startRound();
      } else {
        gameEnded = true;  //end the game and provide the text
        document.getElementById("prompt").textContent = "Game over!";
        document.getElementById("score").textContent = `You got ${score} correct and ${5 - score} incorrect.`;
        document.getElementById("feedback").textContent = "";
        activeRound = null;
      }
    }
  });

  //Starting the round
  startRound();
}

//iterrating between each round and providing score
function startRound() {
  activeRound = locations[rounds - 1];
  document.getElementById("prompt").textContent = `Round ${6 - rounds}: Double click on the ${activeRound.name}`;
  document.getElementById("score").textContent = `Score: ${score}`;
}

let startTime = null;

//Updating the timer
function updateTimer() {
  if (startTime && !gameEnded) {
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    document.getElementById("timer").textContent = `Time: ${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}

initMap();
