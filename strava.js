// Replace these with your own client ID and client secret
const clientId = '98135'
const clientSecret = '250fb83eda23244fd4a165a4a8565f398a5e1e56';

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

  const userData = await response.json();
  return userData;
  console.log(userData);
}

// Main function to authorize and get data from a Strava user
async function main() {
  const code = getAuthorizationCodeFromUrl();
  if (!code) {
    redirectToStravaAuth();
  } else {
    const accessToken = await getAccessToken(code);
    await getStravaUserData(accessToken);
  }
}

function displayUserData() {
    var profileJSON = getStravaUserData();
    var profile = JSON.parse(profileJSON)
    document.getElementById('profileIcon0').style.backgroundImage=profile.profile; // specify the image path here4
    document.getElementById('profileName0').style.backgroundImage=profile.profile; // specify the image path here4
    document.getElementById('profileTag0').innerHTML=profile.firstname + profile.lastname; // specify the image path here4
}