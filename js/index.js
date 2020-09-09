const iconBasePoint = `http://openweathermap.org/img/wn/`;
const endpoint = "https://api.openweathermap.org/data/2.5/weather?";								   
const apiKey = "4a2bf65c140b204aed9f0631644d4851";
const city = "London";
const searchedHistory = {

};

// What I do
startApp();

// How I do it

function handleFindButton(event){
	try{
		const input = document.querySelector('input')
		if(input.value === "")
		{
			throw "Please, insert a city name";
		}
		getDataByCity(input.value);
	}catch(err){
		handleErrorMessage(err);
	}
}
function handleErrorMessage(err){
	const output = document.querySelector('.output')
	output.innerHTML = err;

}
function startApp (){
	getLocation();

	const findButton = document.querySelector('.findButton');
	findButton.addEventListener('click',handleFindButton);
}
// display searched location in DOM
function displaySearchedLocation(searchedLocation){
	console.log("searched location",searchedLocation);
	const searchesContainer = document.querySelector('.searchesContainer');
	const cityWeather = document.createElement('div');
	cityWeather.classList.add('card');
	let icon = searchedLocation.weather_icon;
	cityWeather.innerHTML = 
	`<div class="title">${searchedLocation.name}</div>
	<div class="temperature">${searchedLocation.temperature}&#8451;</div>
	<img src="${icon}" alt="weather-icon" class="icon">`;
	searchesContainer.appendChild(cityWeather);
}
// display the current  in DOM
function displayCurrentLocation(weatherObject){
	const showcaseContainer = document.querySelector('.showcaseContainer');
	const currentWeather = document.createElement('div');
	currentWeather.classList.add('showcase');
	currentWeather.innerHTML = 
	`<div class="location">${weatherObject.name}</div>
	<div class="temperature">${weatherObject.temperature}&#8451;</div>
	<div class="sunrise">Sunrise at ${weatherObject.sunrise}</div>
	<div class="sunset">Sunset at ${weatherObject.sunset}</div>
	`;
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
	return formattedTime;
}
// get data to one location
function createObject(response){
	// console.log("response is",response);

	const weatherObject = {
		id: response.id,
		name: response.name,
		temperature: convertTemperature(response.main.temp),
		sunrise: getTimeFromUTC(response.sys.sunrise),
		sunset: getTimeFromUTC(response.sys.sunset),
		weather: response.weather[0].description,
		weather_icon: `${iconBasePoint}${response.weather[0].icon}@2x.png`,
	}
	// console.log("object is",weatherObject);

	return weatherObject;

}

async function getLocationWeather(location){


	const query = `lat=${location.latitude}&lon=${location.longitude}`;
	const url = `${endpoint}${query}&APPID=${apiKey}`;
	
	const response = await fetch(url);
	const data = await response.json();
	const resultObject = createObject(data);

	displayCurrentLocation(resultObject);


}
async function getDataByCity(city) {

	try{
		const cityQuery =  `q=${city}`;
		const url = `${endpoint}${cityQuery}&APPID=${apiKey}`;
	
		const response = await fetch(url);
		const data = await response.json();
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
	
	
	}catch(err){
		handleErrorMessage(err);
	}
}

async function getLocation() {

	function locationRetrieved(position) {
		const currentLocation = position.coords;
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


