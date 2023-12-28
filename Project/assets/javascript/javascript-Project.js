

"use strict"

// HTML Elements
let searchButton = document.getElementById('#search_button');
let NameInputElement = document.querySelector('#nameInput');  
let EmailInputElement = document.querySelector('#emailInput');  
let StationInputElement = document.querySelector('#stationInput');  
let resultDiv = document.getElementById('result');

//API variables
const API_URL = "http://129.80.194.57";
const USER_INFO_URL = API_URL + "/userInfo";
const MEMBER_INFO_URL = API_URL + "/memberInfo";
const STATION_INFO_URL = API_URL + "/station";
let apiQuery;




async function DisplaySearchResults()
{

    let userData = await GetUserInfo();
    console.log(userData); 
    if(userData.length === 0)
    {
        resultDiv.innerHTML = '<h1>No user match.</h1>'
        return
    }

    let membershipData = await GetMembershipInfo(userData); 
    console.log(membershipData); 

    resultDiv.innerHTML += `
    <div id="membership_container">
        <h2>${membershipData[0].MembershipTypeName}</h2>
        <ul class="membership-list">
            <li>Unlocking Fee: $${membershipData[0].UnlockingFee}</li>
            <li>Security Deposit:   $${membershipData[0].SecurityDeposit}</li>
            <li>0 to ${membershipData[0].FreeMinutes} min: Unlimited</li>
            <li>45+ min : ${membershipData[0].RegularBikePricePerMinute}₵ / minute</li>
        </ul>
    </div>
`;


    let stationData = await getStationInfo();
    console.log(stationData)

    resultDiv.innerHTML += `
    <div id="station_container">
        <h2>${stationData[0].StationName}</h2>
        <div id="station-availabilities">

            <div id="station-bikes">
                <h1>${stationData[0].RegularBikesCount}</h1>
                <p>Bikes</p>
            </div>

            <div id="station-docks">
            <h1>${stationData[0]['Total Docks']}</h1>
            <p>Docks</p>
            </div>
        </div>
        <p id="stationId-text" >Bike Station: ${stationData[0].StationId}

    </div>
`;


}



async function GetUserInfo() 
{
    let firstName = NameInputElement.value;
    let email = EmailInputElement.value;

    // if (firstName.length === 0 ) {
    //     alert("Please enter your First Name.");
    //     return;
    // }

    // if (email.length === 0 ) {
    //     alert("Please enter your Email.");
    //     return;
    // }

    // const response = await fetch(`${USER_INFO_URL}/${firstName}/${email}`);
    const response = await fetch(`${USER_INFO_URL}/Zach/aang@avatar.com`);
    if (response.ok) {
        const userData = await response.json(); // Await the result before using it
        return userData;
    } else {
        throw new Error(`Failed to fetch user information: ${response.status}`);
    }
}


async function GetMembershipInfo(userData) 
{

    let membershipID = userData[0].MembershipTypeId

    const response = await fetch(`${MEMBER_INFO_URL}/${membershipID}`);
    if (response.ok) {
        const membershipData = await response.json(); // Await the result before using it
        return membershipData;
    } else {
        throw new Error(`Failed to fetch member information: ${response.status}`);
    }
}


async function getStationInfo() 
{
    let stationID = StationInputElement.value;

    // const response = await fetch(`${STATION_INFO_URL}${stationID}`);
    const response = await fetch(`${STATION_INFO_URL}/6323`);
    if (response.ok) {
        const stationData = await response.json(); // Await the result before using it
        return stationData;
    } else {
        throw new Error(`Failed to fetch station information: ${response.status}`);
    }
}














