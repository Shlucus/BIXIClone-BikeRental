

"use strict"

// HTML Elements
let searchButton = document.getElementById('search_butt');
let tripResultDiv = document.getElementById('trip_input_results');
let userResultDiv = document.getElementById('user_input_results');
let durationSlider = document.getElementById('slider_container');
let stationContainer = document.querySelector('.station_containers');
let nameInputElement = document.querySelector('#nameInput');
let additionalInfoDiv = document.getElementById('station_aditional_info');
let emailInputElement = document.querySelector('#emailInput');
let stationInputElement = document.querySelector('#stationInput');

//API variables
const API_URL = "http://129.80.194.57";
const USER_INFO_URL = `${API_URL}/userInfo`;
const MEMBER_INFO_URL = `${API_URL}/memberInfo`;
const STATION_PATH_URL = `${API_URL}/path`;
const STATION_INFO_URL = `${API_URL}/station`;
const AVERAGE_SPEED_URL = `${API_URL}/averageBikeSpeed`;
const NEARBY_STATIONS_URL = `${API_URL}/nearbystations`;
const STATION_DISTANCE_URL = `${API_URL}/distance`;



async function DisplaySearchResults() {


    userResultDiv.innerHTML = "";

    let firstName = nameInputElement.value;
    let email = emailInputElement.value;
    let stationID = stationInputElement.value;

    // if (firstName === "" || email === "" || stationID === "")
    // {
    //     alert("Please fill in all fields");
    //     return
    // }


    // let userData = await fetchAPIData(`${USER_INFO_URL}/${firstName}/${email}`);
    let userData = await fetchAPIData(`${USER_INFO_URL}/Zach/aang@avatar.com`);
    console.log(userData);
    if (userData.length === 0) {
        userResultDiv.innerHTML = '<h1>No user match.</h1>'
        return
    }

    let membershipID = userData[0].MembershipTypeId
    let membershipData = await fetchAPIData(`${MEMBER_INFO_URL}/${membershipID}`);
    console.log(membershipData);

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

     
    let stationData = await fetchAPIData(`${STATION_INFO_URL}/${stationID}`);
    console.log(stationData)

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

    document.getElementById('trip_input_container').style.display = 'flex';
    document.getElementById('user_input_container').style.display = 'none';
}






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

    // Filter out all stations who arent within possible range.
    const filteredStations = nearbyStationsData.filter(station => station.Distance <= maxPossibleDistance);
    if (filteredStations.length === 0)
    {
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

        let stationData = await fetchAPIData(`${STATION_INFO_URL}/${station.SecondStationId}`)

        //Calculate the amount of AVAILABLE Docks 
        let availableDocks = (stationData[0]['Total Docks']) - (stationData[0].RegularBikesCount + stationData[0].ElectricBikesCount)

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



async function DisplayTripPath(destinationId) {


    tripResultDiv.innerHTML = `<h3>Path to destination</h3>
                               <label>(Click for more information below)</label>`;


    let startStationId = stationInputElement.value;
    let endStationId = destinationId;

    let pathData = await fetchAPIData(`${STATION_PATH_URL}/${startStationId}/${endStationId}`);

    console.log(pathData);

    let stations = pathData[0]; // Assuming the stations are in the first element of pathData

    // using for-loop because forEach conflicts with async.
    for (let i = 0; i < stations.length; i++) {
        const currentStation = stations[i];
        const nextStation = stations[i + 1];

        // console.log(currentStation)
        // console.log(nextStation)

        tripResultDiv.innerHTML += `
        <div class="station_path_buttons">
            <button class="additional_info" data-query="${currentStation.StationId}" onclick="DisplayAdditionalInfo(this.dataset.query)">Station ${currentStation.StationId}</button>
        </div>
    `;


        if (i >= 0 && i < stations.length - 1) {
            let distanceData = await fetchAPIData(`${STATION_DISTANCE_URL}/${currentStation.StationId}/${nextStation.StationId}`);
            let connectionDistance = distanceData[0].Distance;
            console.log(distanceData);
            console.log(connectionDistance)

            // Delay before displaying the next station
            await delay(connectionDistance * 10);
        }
    }

    // Display a message after reaching the destination
    const destinationStation = pathData[0][pathData[0].length - 1];
    tripResultDiv.innerHTML += `<h3>Arrived at destination station ${destinationStation.StationId}!</h3>`;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




// async function fetchAPIData(url) {
//     const response = await fetch(url);
//     if (response.ok) {
//         const ApiData = await response.json(); // Await the result before using it
//         return ApiData;
//     } else {
//         throw new Error(`Failed to fetch information from API: ${response.status}`);
//     }
// }


async function fetchAPIData(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`Failed to fetch information from API: ${response.status}`);
        }
    } catch (error) {
        console.error(error.message);
    }
}


function updateSliderValue(value) {
    const sliderValueElement = document.getElementById('slider_value');
    sliderValueElement.innerText = value + " min";
}


async function DisplayAdditionalInfo(stationId) {


    let stationData = await fetchAPIData(`${STATION_INFO_URL}/${stationId}`);

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









