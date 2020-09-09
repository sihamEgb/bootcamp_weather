console.log("hello sunny world");

const searchedHistory = {

};
const weatherIcons = {
	sunny: `<i class="fas fa-sun"></i>`,
	cloudy: `<i class="fas fa-cloud"></i>`,
	smog: `<i class="fas fa-smog"></i>`,
	wind: `<i class="fas fa-wind"></i>`,
	cloud_sun_rain: `<i class="fas fa-cloud-sun-rain"></i>`,
	cloud_sun: `<i class="fas fa-cloud-sun-rain"></i>`,
	cloud_showers_heavy: `<i class="fas fa-cloud-showers-heavy"></i>`,
	cloud_rain: `<i class="fas fa-cloud-showers-heavy"></i>`,
	snowflake: `<i class="fas fa-snowflake"></i>`
}

const endpoint = "https://api.openweathermap.org/data/2.5/weather?";
											   
const apiKey = "4a2bf65c140b204aed9f0631644d4851";
// api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=4a2bf65c140b204aed9f0631644d4851
const city = "London";


// What I do
startApp();

// How I do it

function handleFindButton(event){
	const input = document.querySelector('input')
	// console.log("event is",event);
	console.log(input);
	console.log(input.value);
	getDataByCity(input.value);
}
function handleErrorMessage(err){
	const output = document.querySelector('.output')
	output.innerHTML = err;

}
function startApp (){
  let data = [];
	getLocation();

	const findButton = document.querySelector('.findButton');
	console.log(findButton);
	findButton.addEventListener('click',handleFindButton);
  // getData();
}
// display searched location in DOM
function displaySearchedLocation(searchedLocation){
	console.log("searched location",searchedLocation);
	const searchesContainer = document.querySelector('.searchesContainer');
	const cityWeather = document.createElement('div');
	cityWeather.classList.add('card');
	let icon = weatherIcons['sunny'];
	if(searchedLocation.temperature < 20)
	{
		icon = weatherIcons['cloudy'];
	}
	cityWeather.innerHTML = 
	`<div class="title">${searchedLocation.name}</div>
	<div class="temperature">${searchedLocation.temperature}&#8451;</div>
	<div class="icon">${icon}</div>`;
	searchesContainer.appendChild(cityWeather);
}
// display the current  in DOM
function displayCurrentLocation(weatherObject){
	const showcaseContainer = document.querySelector('.showcaseContainer');
	const currentWeather = document.createElement('div');
	currentWeather.classList.add('showcase');
	currentWeather.innerHTML = 
	`<div class="name">
		<div class="title">Weather In</div>
		<div class="value">${weatherObject.name}</div>
	</div>
	<div class="temperature">
		<div class="title">Temperature</div>
		<div class="value">${weatherObject.temperature}&#8451;</div>
	</div>
	<div class="sunrise">
		<div class="title">Sunrise</div>
		<div class="value">${weatherObject.sunrise}</div>
	</div>
		<div class="sunset">
		<div class="title">Sunset</div>
		<div class="value">${weatherObject.sunset}</div>
	</div>`;
	showcaseContainer.appendChild(currentWeather);

}
// convert from K to C
function convertTemperature(TempKelvin){
 return TempKelvin = (TempKelvin - 273.15).toFixed(2);
}
function getTimeFromUTC(unix_timestamp){
	
	const date = new Date(unix_timestamp * 1000);
	const hours = date.getHours();
	const minutes = "0" + date.getMinutes();
	const seconds = "0" + date.getSeconds();

	// Will display time in 10:30:23 format
	const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

	console.log(formattedTime);
	return formattedTime;
}
// get data to one location
function createObject(response){
	console.log("response is",response);

	const weatherObject = {
		id: response.id,
		name: response.name,
		temperature: convertTemperature(response.main.temp),
		sunrise: getTimeFromUTC(response.sys.sunrise),
		sunset: getTimeFromUTC(response.sys.sunset),
	}
	return weatherObject;

}

async function getLocationWeather(location){


	const query = `lat=${location.latitude}&lon=${location.longitude}`;
	const url = `${endpoint}${query}&APPID=${apiKey}`;
	
	const response = await fetch(url);
	const data = await response.json();
	const resultObject = createObject(data);

	displayCurrentLocation(resultObject);

	// console.log(data);

}
async function getDataByCity(city) {

	try{
		const cityQuery =  `q=${city}`;
		const url = `${endpoint}${cityQuery}&APPID=${apiKey}`;
	
		const response = await fetch(url);
		const data = await response.json();
		// console.log("response bla",response);
		// console.log("response bla",data);
		if(data.cod === "404"){
			throw data.message;
		}
		const resultObject = createObject(data);
		
		if(searchedHistory[resultObject.name]){
			throw "City is already shown on screen!";
		}
		else{
			searchedHistory[resultObject.name] = resultObject;
			displaySearchedLocation(resultObject);
		}
	
		console.log(data);

	}catch(err){
		handleErrorMessage(err);
	}
}

async function getLocation() {

	function locationRetrieved(position) {
		const currentLocation = position.coords;
		console.log("#############");
		console.log(currentLocation);
		console.log(currentLocation.latitude);
		console.log(currentLocation.longitude);
		//make api call to get weather
		getLocationWeather(currentLocation);
	}

	if (navigator.geolocation) 
	{
			navigator.geolocation.getCurrentPosition(locationRetrieved);	
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}



async function getCurrentLocation(){
	const options = {
		enableHighAccuracy: true,
		timeout: 50000,
		maximumAge: 0
	};
	const error = (err) => {
		console.warn(`ERROR(${err.code}): ${err.message}`);
	};
	const success = (pos) => {
		let crd = pos.coords;
		console.log('Your current position is:');
		console.log(`Latitude : ${crd.latitude}`);
		console.log(`Longitude: ${crd.longitude}`);
		console.log(`More or less ${crd.accuracy} meters.`);
		currentLocation = crd;
		console.log(currentLocation);
	};
	navigator.geolocation.getCurrentPosition(success, error, options);
}


