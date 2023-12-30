/*

__/\\\\\\\\\\\\\______/\\\\\\\\\___________/\\\\\___________/\\\\\\\\\\\__/\\\\\\\\\\\\\\\________/\\\\\\\\\__/\\\\\\\\\\\\\\\_        
 _\/\\\/////////\\\__/\\\///////\\\_______/\\\///\\\________\/////\\\///__\/\\\///////////______/\\\////////__\///////\\\/////__       
  _\/\\\_______\/\\\_\/\\\_____\/\\\_____/\\\/__\///\\\__________\/\\\_____\/\\\_______________/\\\/_________________\/\\\_______      
   _\/\\\\\\\\\\\\\/__\/\\\\\\\\\\\/_____/\\\______\//\\\_________\/\\\_____\/\\\\\\\\\\\______/\\\___________________\/\\\_______     
    _\/\\\/////////____\/\\\//////\\\____\/\\\_______\/\\\_________\/\\\_____\/\\\///////______\/\\\___________________\/\\\_______    
     _\/\\\_____________\/\\\____\//\\\___\//\\\______/\\\__________\/\\\_____\/\\\_____________\//\\\__________________\/\\\_______   
      _\/\\\_____________\/\\\_____\//\\\___\///\\\__/\\\_____/\\\___\/\\\_____\/\\\______________\///\\\________________\/\\\_______  
       _\/\\\_____________\/\\\______\//\\\____\///\\\\\/_____\//\\\\\\\\\______\/\\\\\\\\\\\\\\\____\////\\\\\\\\\_______\/\\\_______ 
        _\///______________\///________\///_______\/////________\/////////_______\///////////////________\/////////________\///________


-----------------------------.
 * Student: Lucas Lalumiere  |
 * ID: 2278139               |
 * BIXI PROJECT - JS         |
 *--------------------------*/

"use strict"

// HTML Elements
let searchButton = document.getElementById('search_butt');
let tripResultDiv = document.getElementById('trip_input_results');
let userResultDiv = document.getElementById('user_input_results');
let durationSlider = document.getElementById('slider_container');
let stationContainer = document.querySelector('.station_containers');
let nameInputElement = document.querySelector('#name_Input');
let additionalInfoDiv = document.getElementById('station_aditional_info');
let emailInputElement = document.querySelector('#email_Input');
let stationInputElement = document.querySelector('#station_Input');

//API variables
const API_URL = "http://129.80.194.57";
const USER_INFO_URL = `${API_URL}/userInfo`;
const MEMBER_INFO_URL = `${API_URL}/memberInfo`;
const STATION_PATH_URL = `${API_URL}/path`;
const STATION_INFO_URL = `${API_URL}/station`;
const AVERAGE_SPEED_URL = `${API_URL}/averageBikeSpeed`;
const NEARBY_STATIONS_URL = `${API_URL}/nearbystations`;
const STATION_DISTANCE_URL = `${API_URL}/distance`;



//-----------------------------------------------------------------------------------
// - Function that processes user input (FirstName,Email,StationId)
//   and retreives user, member and station data using fetch.
// - Displays the results by populating HTML elements .innerHTML attributes.
//-----------------------------------------------------------------------------------
async function DisplaySearchResults() {

    // Clear the results
    userResultDiv.innerHTML = "";

    // retreive User input values
    let firstName = nameInputElement.value;
    let email = emailInputElement.value;
    let stationID = stationInputElement.value;

    //If user leaves a field empty, stop the function.
    // if (firstName === "" || email === "" || stationID === "")
    // {
    //     alert("Please fill in all fields");
    //     return
    // }

    // Use API to fetch user info from the users input values and assign response to variable.
    // let userData = await fetchAPIData(`${USER_INFO_URL}/${firstName}/${email}`);
    let userData = await fetchAPIData(`${USER_INFO_URL}/Zach/aang@avatar.com`);
    console.log(userData);

    //If the fetch returns an empty array, no users were found:
    if (userData.length === 0) {
        userResultDiv.innerHTML = '<h1>No user match.</h1>' // display to user.
        return
    }

    // Retreive the user's membershipTypeID from the API response
    let membershipID = userData[0].MembershipTypeId

    // Use API to fetch membership details of the user.
    let membershipData = await fetchAPIData(`${MEMBER_INFO_URL}/${membershipID}`);
    console.log(membershipData);

    //Fill the Result HTML element with the results of the fetch.
    userResultDiv.innerHTML += `
    <div id="membership_container">
        <label>Membership Type</label>
        <h2>${membershipData[0].MembershipTypeName}</h2>
        <ul class="membership-list">
            <li> <b>Unlocking Fee</b> : $${membershipData[0].UnlockingFee}</li>
            <li> <b>Security Deposit</b> :   $${membershipData[0].SecurityDeposit}</li>
            <li> <b>0 to ${membershipData[0].FreeMinutes} min</b> : Unlimited</li>
            <li> <b>45+ min</b> : ${membershipData[0].RegularBikePricePerMinute}₵ / minute</li>
        </ul>
    </div>
    `;

    // Fetch station data based on the user's starting station input
    let stationData = await fetchAPIData(`${STATION_INFO_URL}/${stationID}`);
    console.log(stationData)

    // Display the starting station information in the user result div
    userResultDiv.innerHTML += `
    <div id="station_container">
        <label>Starting Station</label>
        <h2>${stationData[0].StationName}</h2>
        <div id="station-availabilities">

            <div id="station-bikes">
                <h1>${stationData[0].RegularBikesCount}</h2>
                <p>Bikes</p>
            </div>

            <div id="station-docks">
                <h1>${stationData[0]['Total Docks']}</h2>
                <p>Docks</p>
            </div>
        </div>
        <p id="stationId-text" >Bike Station: ${stationData[0].StationId}</p>
        <img id="Station_Banner" src="./assets/images/Bixi-all-year-Application-Banner-V1-2023.png" alt="Station Banner">
    </div>
    `;

    // un-hide the next input prompt 'trip_input_container' and hide the current.
    document.getElementById('trip_input_container').style.display = 'flex';
    document.getElementById('user_input_container').style.display = 'none';
}




//-----------------------------------------------------------------------------------
// - Similar to the former, this method uses user input (slider value)
//   to find nearby stations based on the Maximum minutes of their trip.
// - Displays these nearby stations in the HTML, each having buttons that 
//   a user can use to select their desired destination/station.
//-----------------------------------------------------------------------------------
async function DisplayPossibleTrips() {

    // Assign the current slider value to variable
    let selectedMinutes = document.getElementById('myRange').value;
    console.log(selectedMinutes)

    //fetch average bike speed from API
    let speedData = await fetchAPIData(AVERAGE_SPEED_URL);
    let speedInKiloPerMin = speedData.speed; // In Km/h
    let SpeedInMetersPerMin = (speedInKiloPerMin * 1000) / 60;
    console.log(SpeedInMetersPerMin)

    // calculate the max possible distance the user can cover on their trip.
    let maxPossibleDistance = SpeedInMetersPerMin * selectedMinutes
    console.log(maxPossibleDistance)

    // retrieve the user's previously inputted Starting Station ID
    let StartingStationID = stationInputElement.value;
    console.log(StartingStationID)

    // fetch nearby stations data from API and assign to variable
    let nearbyStationsData = await fetchAPIData(`${NEARBY_STATIONS_URL}/${StartingStationID}`)
    console.log(nearbyStationsData)

    // Filter out all stations who arent within possible range. If the filtered array is empty, escape function and display it to user
    const filteredStations = nearbyStationsData.filter(station => station.Distance <= maxPossibleDistance);
    if (filteredStations.length === 0) {
        tripResultDiv.innerHTML = '<h1>No trip results.</h1>'
        return
    }
    console.log(filteredStations)

    // Clear the screen and only display the new information:
    document.getElementById('trip_input_container').style.display = 'none';
    userResultDiv.innerHTML = "";

    // Display instructions
    tripResultDiv.innerHTML = "<h3>Click on a desired End Station:</h3?"

    // display each(filtered) nearby station as a HTML container:
    filteredStations.forEach(async station => {

        // Use fetch to retreive the information of each station.
        let stationData = await fetchAPIData(`${STATION_INFO_URL}/${station.SecondStationId}`)

        //Calculate the amount of AVAILABLE Docks 
        let availableDocks = (stationData[0]['Total Docks']) - (stationData[0].RegularBikesCount + stationData[0].ElectricBikesCount)

        // Pupulate the html with container consisting of the station info (Name,ID,AvailableDocks). 
        // Each container has a button that selects the station as the user's endStation and finds the path to that station.
        tripResultDiv.innerHTML += `
        <div class="station_containers">
            <h2>${stationData[0].StationName}</h2>
            <div id="station-availabilities">

                <div id="station-docks">
                    <h1>${availableDocks}</h2>
                    <p>Available Docks</p>
                </div>
            </div>
            <p id="stationId-text" >Bike Station: ${stationData[0].StationId}</p>
            <button class="search_butt" data-query="${station.SecondStationId}" onclick="DisplayTripPath(this.dataset.query)">Confirm trip</button>
        </div>
    `;
    });
}

//-----------------------------------------------------------------------------------
// - Once the user has chosen their end station, this method 
//   displays the path of stations starting from their starting station.
// - Progressively displays the upcoming stations with delays relative to their
//   distance from eachother.
// - Once a station has been loaded to the HTML, the user has the option to "select"
//   a station to display further information about said station.
//-----------------------------------------------------------------------------------
async function DisplayTripPath(destinationId) {

    //Refresh the HTML and show a header and instructions
    tripResultDiv.innerHTML = `<h3>Path to destination</h3>
                               <label>(Click for more information below)</label>`;


    //Assign start and end stations to variables
    let startStationId = stationInputElement.value; // initial user input
    let endStationId = destinationId;               // user's selected end station

    // retreive the station path from fetching the API using the ID's of the start and end stations.
    let pathData = await fetchAPIData(`${STATION_PATH_URL}/${startStationId}/${endStationId}`);

    console.log(pathData);

    // retreive the array of stations that make up the path.
    let stations = pathData[0]; // Assuming the stations are in the first element of pathData

    // Loop through each station in the path array (using for-loop because forEach conflicts with async.)
    for (let i = 0; i < stations.length; i++) {

        // assign to variables station ID's of the current and next array index (used to calculate delay)
        const currentStation = stations[i];
        const nextStation = stations[i + 1];

        //ppopulate result container with the current station iteration (as a button)
        tripResultDiv.innerHTML += `
        <div class="station_path_buttons">
            <button class="additional_info" data-query="${currentStation.StationId}" onclick="DisplayAdditionalInfo(this.dataset.query)">Station ${currentStation.StationId}</button>
        </div>
    `;

        // if the user is NOT the end Station:
        if (i >= 0 && i < stations.length - 1) {

            //fetch the distance between the current station and the next from the API
            let distanceData = await fetchAPIData(`${STATION_DISTANCE_URL}/${currentStation.StationId}/${nextStation.StationId}`);
            let connectionDistance = distanceData[0].Distance;

            // start a delay based on the distance (100 meters = 1 second) 
            await delay(connectionDistance * 10);
        }
    }

    // Display a message after reaching the destination
    const destinationStation = pathData[0][pathData[0].length - 1];
    tripResultDiv.innerHTML += `<h3>Arrived at destination station ${destinationStation.StationId}!</h3>`;
}






//----------------------------------------------------------
// - Function that creates useless promises.
// - Uses setTimeout to create a delay with passed in value.
//-----------------------------------------------------------
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




//--------------------------------------------------------
// - Asynchronous function to fetch data from the specified URL.
// ---------------------------------------------------------
async function fetchAPIData(url) {
    try {
        // Attempt to fetch data from the passed URL.
        const response = await fetch(url);

        // Check if response status is OK...
        if (response.ok) {
            // If so, parse and return the JSON data from the response
            return await response.json();
        } else {
            // If not, throw an error with message
            throw new Error(`Failed to fetch information from API: ${response.status}`);
        }
    } catch (error) {
        // Catch and log errors that happend during fetching.
        console.error(error.message);
    }
}

//------------------------------------------------------------------
// - Method used to dynamically display the sliders value in the html.
// - Called from the html.
//------------------------------------------------------------------
function updateSliderValue(value) {
    // 1. assign element to variable resposible for displaying the sliders value
    const sliderValueElement = document.getElementById('slider_value');
    // 2. update the html text based on the passed in value.
    sliderValueElement.innerText = value + " min";
}

//--------------------------------------------------------------------
// - Function that upon the click of a path station, will display
//   additional station data of said station under the path of stations.
// ------------------------------------------------------------------------
async function DisplayAdditionalInfo(stationId) {

    // Fetch aditional about the selected station using fetch 
    let stationData = await fetchAPIData(`${STATION_INFO_URL}/${stationId}`);

    // Update the html content of the additionalInfoDiv with station details(Longitude,Latitude & Available Docks).
    additionalInfoDiv.innerHTML = `
    <div id="additional_info_container">
        <label>Selected Station</label>
        <h2>${stationData[0].StationName}</h2>
        <div id="additional_station_info">

            <p>Available Docks: ${stationData[0]['Total Docks'] - stationData[0].RegularBikesCount - stationData[0].ElectricBikesCount}</p>
            <p>Latitude: ${stationData[0].Latitude}</p>
            <p>Longitude: ${stationData[0].Longitude}</p>

        </div>
        <p id="stationId-text" >Bike Station: ${stationData[0].StationId}</p>
        <img id="Station_Banner" src="./assets/images/Bixi-all-year-Application-Banner-V1-2023.png" alt="Station Banner">
    </div>
`;

}









