const clientId = '98135'
const clientSecret = '250fb83eda23244fd4a165a4a8565f398a5e1e56';
var userData
var startDate = 0;
var endDate = 9999999999;
var displayAmount = 9999;
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

// Step 1: Redirect the user to the Strava authorization page
function redirectToStravaAuth() {
  console.log('Starting Auth Sequence')
  const redirectUri = 'https://levtus.github.io/vis';
  const responseType = 'code';
  const scope = 'read,activity:read';
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

  window.location.href = authUrl;
    
}

// Step 2: Get the authorization code from the URL
function getAuthorizationCodeFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams.get('code'))
  return urlParams.get('code');
}

// Step 3: Exchange the authorization code for an access token
async function getAccessToken(code) {
  const tokenUrl = 'https://www.strava.com/oauth/token';
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
  
  const data = await response.json();
  console.log(data.acces_token)
  return data.access_token;
}

// Step 4: Use the access token to make requests to the Strava API
async function getStravaUserData(accessToken) {
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

// Main function to authorize and get data from a Strava user
async function main() {
  const code = getAuthorizationCodeFromUrl();
  if (!code) {
    redirectToStravaAuth();
    const accessToken = await getAccessToken(code);
    await getStravaUserData(accessToken);
  } else {
    const accessToken = await getAccessToken(code);
    await getStravaUserData(accessToken);
  }
}

function displayUserData() {
    main()
    name = (userData.firstname + " " + userData.lastname)
    tag = ("@" + userData.username)
    profilePicture = userData.profile
    creationDate = userData.created_at
    country = userData.country
    weight = userData.weight
    document.getElementById('.profileIcon').style.backgroundImage = `url('${userData.profile}')`;
    document.querySelector('.flag').style.backgroundImage=("https://flagpedia.net/data/flags/icon/72x54/"+ country + ".webp")
    document.querySelector('.profileName').innerHTML=(userData.firstname + " " + userData.lastname); 
    document.querySelector('.profileTag').innerHTML=("@" + userData.username); 
}

async function getAllUserRides() {
    const accessToken = await getAccessToken(code);
    const apiUrl = `https://www.strava.com/api/v3/athlete/activities?before=${endDate}&after=${startDate}&per_page=${displayAmount}`;
  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  var userActivities = await response.json();
  console.log(userActivities);
  return userActivities;
}

$('#picker').colpick({
    colorScheme:'dark',
    onChange:function(hsb,hex,rgb,el,bySetColor) {
    mapColor = '#' + hex;    
    };
}
                         console.log("Color Changed To " + mapColor)
                    );

function getAllRidesData()) {
    var userActivities = getAllUserRides()
    for (let i = 0; i < userActivities.length; i++) {
       activityNames.push(userActivities[i].name);
       activityIds.push(userActivities[i].id);
       activityTypes.push(userActivities[i].type);
       isCommute.push(userActivities[i].commute);
       polylines.push(userActivities[i].map.summary_polyline)
       distances.push(userActivities[i].distance);
       elapsedTimes.push(userActivities[i].elapsed_time);
       movingTimes.push(userActivities[i].moving_time);
       averageWatts.push(userActivities[i].average_watts);
       kiloJoules.push(userActivities[i].kilojoules);
       startDates.push(userActivities[i].start_date_local);
       kudosCounts.push(userActivities[i].kudos_count);
       achievementCounts.push(userActivities[i].achievement_count);     
  }
  var mapStyle = document.getElementById('mapStyle').selectedOptions[0].value;
    if (mapStyle = "Heatmap") {
        opacity = 0.3;
    } else {
        opacity = 1;
   }

  for (let i = 0; i < polylines.length; i++) {
        var coordinates = L.Polyline.fromEncoded(userActivities[i].map.summary_polyline).getLatLngs()
         L.polyline(
            coordinates,
                {
                color: mapColor,
                weight:5,
                opacity:opacity,
                lineJoin:'round'
                }
        ).addTo(map)
  }
}