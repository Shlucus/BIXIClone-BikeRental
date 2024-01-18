# BIXI Clone
In this project, my objective is creating a clone website of Montreal's largest bike rental system: BIXI. This project is the result of one of my final Web Programming Projects for my third semester at John Abbott College. 

<img src="https://github.com/Shlucus/BIXIClone-BikeRental/assets/111912000/1e549ae0-a433-4269-8385-898c622153a1" alt="Splash" width="auto">

## Overview
Initially, users of the web page should be able to specify:
 - a) Their email address and first name
 - b) The station id they want to rent a bike from.

*(<ins>Note</ins>, the data here is limited for now, to test use the following info:) stations on this path*):*
 - Station: 6323 - 6322 - 8153 - 8075
 - User credentials:
<img src="https://github.com/Shlucus/BIXIClone-BikeRental/assets/111912000/835b1f5f-ecc7-4b5b-a2c9-b4f55c02020c" alt="Users" width="auto">
<br>
<img src="https://github.com/Shlucus/BIXIClone-BikeRental/assets/111912000/75da685c-b9c3-4442-a4d4-d613ef24da4e" alt="Credentials example" width="auto">



### Membership Information
Using the first name and email, the member information can be obtained. For the given member, their membership info will be displayed.
Membership information includes a number of free bixi rental minutes, as well as rates per
minute for the rental of regular bikes (for this project, we will not consider the electronic bikes).
They will be able to see:
 - a) The number of regular bikes available at their starting station.
 - b) An indication of the details on their membership in terms of the cost of rental (free minutes,
rate by minute past the free minutes)

  <img src="https://github.com/Shlucus/BIXIClone-BikeRental/assets/111912000/6bb50aa2-1a96-48a8-b312-60cab77d7721" alt="Membership/Station info" width="auto">

### Maximum number of minutes
Now that the user knows their membership details, they should be able to specify:
 - a) The amount of maximum minutes they want to spend on a trip.

  <img src="https://github.com/Shlucus/BIXIClone-BikeRental/assets/111912000/f0e362bb-2823-4b98-b571-90edf8a2b039" alt="# of Mins" width="auto">

### Possible Stations
When the user confirms their choice of maximum minutes, they will see:
 - a) The neighbouring stations they could get to within their chosen maximum time. For each
station, they see:
 - b) The station name, the number of available docks (parking spots for bikes).

*(<ins>Note</ins>, the data here is limited for now, to test use the stations on this path):
6323 - 6322 - 8153 - 8075*

  <img src="https://github.com/Shlucus/BIXIClone-BikeRental/assets/111912000/76cef24b-6393-4afa-8294-ca222012522a" alt="Possible stations" width="auto">




### Chosen trip
If the user chooses a station from that collection of stations they could get to, they will then be
shown the path of stations to their destination.
The path will be shown, one station at a time. The delay between showing the stations on the
bath will be relative to the amount it would take to get to that station in the path.

  <img src="https://github.com/Shlucus/BIXIClone-BikeRental/assets/111912000/433882c8-b64c-4aca-a31a-cef90e96bcfe" alt="Possible stations" width="auto">

Every station on the path is be selectable. The user will be able to see 3 pieces of
additional information specific to the chosen station (Station name, Number of available Docks,
Longitude, Latitude).


  <img src="https://github.com/Shlucus/BIXIClone-BikeRental/assets/111912000/2715e26f-cd75-4716-a63d-736469d550d4" alt="Possible stations" width="auto">



### API endpoints:
*(<ins>Note</ins>, this API was NOT created by me. It was provided to me and is publicly available)*
<br>
Web server is publicly accessible directly (no need to go through VPN) at:
`http://129.80.194.57`.
The following endpoints are available:
 - `/userInfo/<member_first_name>/<member_email_address`
Provides member information including the memberTypeId.
For example: http://129.80.194.57/userInfo/Jack/sokka@avatar.com
 - `/memberInfo/<member_type_id>`
Provides membership information.
For example: http://129.80.194.57/memberInfo/1
 - `/nearbystations/<stationid>`
Provides the stations accessible from that station and the distance away
(Note, the data here is limited for now, to test use stationId 6323)
 - `/averageBikeSpeed`
Speed in km/h.
 - `/station/<stationid>`
Station information including number of bikes available, and number of
docks (bike parking slots) available.
 - `/path/<startStationid>/<endStationid>`
Provides the stations in between the start and end stations
(Note, the data here is limited for now, to test use stations on this path:
6323 - 6322 - 8153 - 8075).
 - `/distance/<startStationid>/<endStationid>`
Provides info on the distance between the two given stations in meters
(Note, the data here is limited for now, to test use stations on this path:
6323 - 6322 - 8153 - 8075).





