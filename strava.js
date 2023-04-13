const clientId = '98135'
const clientSecret = '250fb83eda23244fd4a165a4a8565f398a5e1e56';
var code
var allActivities
var userData
var data
var accessToken
var startDate = 0;
var endDate = (Date.now() / 1000 );
var displayAmount = 999;
var opacity = 1;
var mapColor = "#000000"

const activityNames = [];
const activityIds = [];
const activityTypes = [];
const isCommute = [];
const distances = [];
const elapsedTimes = [];
const movingTimes = [];
const averageWatts = [];
const kiloJoules = [];

const startDates = [];
const kudosCounts = [];
const achievementCounts = [];
const polylines = [];

window.addEventListener("load", (event) => {
  getAuthorizationCodeFromUrl() 
  if (code) {
    console.log('Code Found on Load') 
  } else {
    console.log('Code Not Present on Load') 
  }
});

// Redirect the user to the Strava authorization page
function redirectToStravaAuth() {
  console.log('Starting Auth Sequence')
  const redirectUri = 'https://levtus.github.io/vis';
  const responseType = 'code';
  const scope = 'read,activity:read';
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
  window.location.href = authUrl;
}

// Get the authorization code from the URL
function getAuthorizationCodeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    code = urlParams.get('code');
    if (code) {
        console.log(code)
        return code
    }
}

// Exchange the authorization code for an access token
async function getAccessToken(code) {
  const tokenUrl = 'https://www.strava.com/oauth/token';
  if (!data || !data.access_token) {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code', 
      }),
    });
    data = await response.json(); 
    console.log("Access Token = " + data.access_token)
  } else {
    console.log("Access Token Already Ready") 
  }
  accessToken = data.access_token;
  return accessToken;
}
 
// Get Basic User Information
async function getStravaUserData() {
    const apiUrl = 'https://www.strava.com/api/v3/athlete';
    const response = await fetch(apiUrl, {
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        },
    });
    userData = await response.json();
    console.log(userData);
    return userData;
}

// Check that all steps have been completed
function check() {
    if (code) {
        console.log('Auth Code is Present')
    } else {
        getAuthorizationCodeFromUrl()
        if (code) {
            console.log('Auth Code Grabbed')
        } else {
            redirectToStravaAuth()
        }
    }
    if (accessToken) {
        console.log('Access Token is Present')
    } else {
        getAccessToken(code)
    }
    if (userData) {
        console.log("User Data is Present")
    } else {
        getStravaUserData()
        displayUserData()
    }
}

function displayUserData() {
    name = (userData.firstname + " " + userData.lastname)
    tag = ("@" + userData.username)
    profilePicture = userData.profile
    creationDate = userData.created_at
    country = userData.country
    weight = userData.weight
    document.querySelector('.profileIcon').style.backgroundImage = `url('${userData.profile}')`;
    document.querySelector('.flag').style.backgroundImage=("https://flagpedia.net/data/flags/icon/72x54/"+ country + ".webp")
    document.querySelector('.profileName').innerHTML=(userData.firstname + " " + userData.lastname); 
    document.querySelector('.profileTag').innerHTML=("@" + userData.username); 
}



function getActivities() {
    getAccessToken(code) 
    const activitiesLink = `https://www.strava.com/api/v3/athlete/activities?access_token=${data.access_token}&per_page="999"`
    fetch(activitiesLink)
    .then((allActivities) => {
        return allActivities.json();
    })
    .then((activityData) => {
        allActivities = activityData;
        console.log(allActivities)
    });
}

function activitiesExec() {
    if (allActivities) {
        console.log('Activity Data is Present')
    } else {
        getActivities()
    }
    if (polylines) {
        console.log('Rides Data Parsed')  
    } else {
        getAllRidesData()
    }
    if (mapped = 1) {
        console.log('Ride Data Mapped')
    } else {
        mapRides()
    }
}

function getAllRidesData() {
    if (!allActivities) {
        getActivities()
    };
    for (let i = 0; i < allActivities.length; i++) {
       activityNames.push(allActivities[i].name);
       activityIds.push(allActivities[i].id);
       activityTypes.push(allActivities[i].type);
       isCommute.push(allActivities[i].commute);
       polylines.push(allActivities[i].map.summary_polyline)
       distances.push(allActivities[i].distance);
       elapsedTimes.push(allActivities[i].elapsed_time);
       movingTimes.push(allActivities[i].moving_time);
       averageWatts.push(allActivities[i].average_watts);
       kiloJoules.push(allActivities[i].kilojoules);
       startDates.push(allActivities[i].start_date_local);
       kudosCounts.push(allActivities[i].kudos_count);
       achievementCounts.push(allActivities[i].achievement_count);     
  };
}

function mapRides() {
    if (!polylines) {
        getAllRidesData()
    }
    var mapStyle = document.getElementById('mapStyle').selectedOptions[0].value;
    if (mapStyle = "Heatmap") {
        opacity = 0.3;
    } else {
        opacity = 1;
    }
    for (let i = 0; i < polylines.length; i++) {
        var coordinates = L.Polyline.fromEncoded(allActivities[i].map.summary_polyline).getLatLngs()
         L.polyline(
            coordinates,
                {
                color: mapColor,
                weight:5,
                opacity:opacity,
                lineJoin:'round'
                }
        ).addTo(map)
    };
    mapped = 1;
}