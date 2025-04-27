const stepTracker = { currentStep: 0 };
const playlistId = {
  focus: {
    lofi: "37i9dQZF1DX8Uebhn9wzrS",
    hype: "37i9dQZF1EIhiz7ffTXlVH",
  },
  meditation: {
    peaceful: "37i9dQZF1DWZqd5JICZI0u",
    guided: "37i9dQZF1DWVS1recTqXhf",
  },
  study: {
    jazz: "37i9dQZF1DX8wWHvPMMfNA",
    nature: "37i9dQZF1DWZ8HCIPoGGKp",
    // cafe: "75avKVUUNDDMgPVCb5vUGh"
  },
  workout: {
    beast: "4m0CG8CxcylD7I5ipKLvmA",
    zone: "37i9dQZF1EIg56D8W4HZiC",
  },
};
const redirectUri = `${window.location.origin}/radio.html`;
const radioButtons = document.querySelectorAll('input[name="playlist-type"]');
let accessToken = null;
let device_id = window.device_id || localStorage.getItem("spotify_device_id");
let trackUri = null;
const scopes = `
user-read-private
user-read-email
playlist-read-private
playlist-read-collaborative
user-top-read
user-library-read
streaming
user-read-playback-state
user-modify-playback-state
`
  .trim()
  .split(/\s+/)
  .join(" ");


  //checks acces token before use
  async function checkAndRefreshAccessToken() {
    const token = localStorage.getItem("access_token");
    const expiresAt = localStorage.getItem("access_token_expires_at");
    
    if (!token || !expiresAt || Date.now() > parseInt(expiresAt)) {
      console.log("🔁 Token missing or expired. Redirecting for auth...");
      
      const clientId = "d831bf8c8a594eaeb5d37469c14d13fe";
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      
      if (!code) {
        // Redirect user to login
        await redirectToAuthCodeFlow(clientId);
        return null; // (page will redirect, this won't actually return)
      } else {

      } const newAccessToken = await getAccessToken(clientId, code);

      if (!newAccessToken) {
        console.error("❌ Failed to refresh access token.");
        return null;
      }

      setTokenWithExpiration(newAccessToken, 3600);
      window.history.replaceState({}, document.title, "/");

      localStorage.setItem("access_token", newAccessToken);
      return newAccessToken;
    }
  
    console.log("✅ Access token ready:", token);
    // localStorage.setItem("access_token", accessToken);
    return token;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const nextPageIntro = document.getElementById("nextPageIntro");
    const signInWithSpotifybtn = document.getElementById("signInWithSpotify");
    const noLogInbtn = document.getElementById("noLogIn");
    const logInWithSpotifybtn = document.getElementById("logInWithSpotify");

    if (nextPageIntro) {
      nextPageIntro.addEventListener("click", nextFunction);
    }
    if (signInWithSpotifybtn) {
      signInWithSpotifybtn.addEventListener("click", signInWithSpotify);
    }
    if (noLogInbtn) {
      noLogInbtn.addEventListener("click", noLogIn);
    }
    if (logInWithSpotifybtn) {
      logInWithSpotifybtn.addEventListener("click", logInWithSpotify);
    }
  });

  function isThisWorking() {
    console.log("✅ Yes it is working!");
  }
 
  

  
//calls next page

function nextFunction() {
  let currentPage = document.getElementById(`step${stepTracker.currentStep}`);
  if (currentPage) {
    currentPage.classList.add("hidden");
  }

  stepTracker.currentStep++;

  let nextPage = document.getElementById(`step${stepTracker.currentStep}`);
  if (nextPage) {
    nextPage.classList.remove("hidden");
  }

  if (stepTracker.currentStep > 5) {
    stepTracker.currentStep = 5; // Prevent going beyond the last step
  }
}

// *** STEP 1 Log in Functions ** //

function signInWithSpotify() {
  logInWithSpotify()
}

function noLogIn() {
  alert("Please remeber if you don't log in, you will have limited use!");
  window.location.href = redirectUri
}

// Attach signIn to the global window for inline HTML onclick usage.

async function logInWithSpotify() {
  console.log("signIn function called");

 accessToken = await checkAndRefreshAccessToken();

  if (!accessToken) {
    console.log("🔐 Access token expired or not found. Re-authenticating...");

      if (!accessToken) {
        console.error("❌ Failed to get access token. Stopping.");
        return;
      }
    }

    console.log("✅ Access token valid:", accessToken);
  }

function setTokenWithExpiration(token, expiresInSeconds) {
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  localStorage.setItem("access_token", token);
  localStorage.setItem("access_token_expires_at", expiresAt.toString());
}

async function getAccessToken(clientId, code) {
  const verifier = localStorage.getItem("verifier");
  console.log("Verifier loaded:", verifier);
  console.log("Code received:", code);

  if (!verifier || !code) {
    console.error("Missing verifier or code");
    return;
  }

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("code_verifier", verifier);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const responseText = await result.text();
  console.log("Token response", responseText);
  const data = JSON.parse(responseText);

  if (data.error) {
    console.error("Error obtaining token:", data.error_description);
    // Re-initiate the auth flow if the authorization code has expired
    redirectToAuthCodeFlow(clientId);
    return;
  }
  return data.access_token;
}


async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);
  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", redirectUri);
  params.append("scope", scopes);
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}


document.getElementById("getProf").addEventListener("click", async () => {
  let token = await checkAndRefreshAccessToken();
  if (!token) return console.error("No token found!");
  const profile = await fetchProfile(token);
  populateUI(profile, token);
});

async function fetchProfile(token) {
  console.log("Token passed to fetchProfile:", token); 
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const profile = await result.json();
  return profile; 
}


function populateUI(profile, accessToken) {
  console.log("Access Token used for profile", accessToken);
  console.log("Populating UI with profile:", profile);
  document.getElementById("displayName").innerText = profile.display_name;
  if (profile.images && profile.images[0]) {
    const profileImage = new Image(200, 200);
    profileImage.src = profile.images[0].url;
    document.getElementById("avatar").appendChild(profileImage);
  }
  document.getElementById("id").innerText = profile.id;
  document.getElementById("followers").innerText = profile.followers.total;
  document.getElementById("country").innerText = profile.country;
  document.getElementById("product").innerText = profile.product;
  document.getElementById("type").innerText = profile.type;
  document.getElementById("uri").innerText = profile.uri;
  document
    .getElementById("uri")
    .setAttribute("href", profile.external_urls.spotify);
  document.getElementById("url").innerText = profile.href;
  document.getElementById("url").setAttribute("href", profile.href);

 
  const buttonContainer = document.getElementById("spotifyConfirm"); 
  if (buttonContainer) {
    buttonContainer.innerHTML = `
      <button class="btn btn--big" id="tryAgain">Wrong account</button>
      <button class="btn btn--big" id="goToRadio">Start session</button>
    `;

    // Add the event listeners *after* the buttons exist
    document.getElementById("goToRadio").addEventListener("click", async () => {
      let token = await checkAndRefreshAccessToken();
      if (!token) return console.error("No token found!");
      nextFunction();
      callPlaylists();
    });

    document.getElementById("tryAgain").addEventListener("click", () => {
      prevPage(); // or whatever your "wrong account" logic is
    });
  }
}

async function callPlaylists() {

  accessToken = await checkAndRefreshAccessToken();

  if (!accessToken) {
    console.error("Access token is missing!");
    return;
  }

  const matchingPlaylists = await handleMoodSelection(); // Call the function to get matching playlists

  if (matchingPlaylists && matchingPlaylists.length > 0) {
    playlistId = matchingPlaylists[0].id;
    console.log("Selected playlist ID:", playlistId);

    // console.log("Access token being used5:", accessToken); DELETE LATER
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      // send request
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    // })
      // .then((res) => res.json()) // parse JSON response
      // .then((data) => {
      //   // do something with the data
      //   console.log("Playlist data??:", data);
      //   console.log(data);
      // })
      // .catch((err) => {
      //   // handle any errors
      //   console.error(err);
      });
      loadSong()
    return playlistId;
  } else {
    console.log("No matching playlists found.");
    return null;
  }

}

// This function will be called when the user selects a mood
// and clicks the button to fetch playlists
async function handleMoodSelection() {
  const mood = radioMood();
  if (!mood) return;

  const sessionKeyword = mood.toLowerCase();
  const allPlaylists = await fetchPlaylists(accessToken); // ← call and await here

  // 🔍 Log ALL playlists for debugging
  // console.log("All playlists returned:", allPlaylists.categories.items);
  console.log("All playlists returned:", allPlaylists);

  const matchingPlaylists = allPlaylists.items.filter((playlist) => {
    const name = playlist.name.toLowerCase();
    const desc = playlist.description?.toLowerCase() || "";
    return (
      // owner.display_name === "made" && //Need to figure out how to get the owner name
      name.includes(sessionKeyword) || desc.includes(sessionKeyword)
    );
  });

  console.log("Matching playlists:", matchingPlaylists);
  return matchingPlaylists;
}

// Selecting mood for playlist
// This function will be called when the user selects a mood
function radioMood() {
  const radioButtons = document.querySelectorAll('input[name="playlist-type"]');
  let selectedValue = null;

  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      selectedValue = radioButton.value;
      break;
    }
  }

  if (
    selectedValue == "focus" ||
    selectedValue == "study" ||
    selectedValue == "workout" ||
    selectedValue == "meditation"
  ) {
    alert(`You have selected: ${selectedValue}`);
    // currentPlaylist = songs[selectedValue]; // assign the song list
    // current = 0;
  } else {
    alert("Please select a mood.");
  }

  return selectedValue; // Return the selected value
}