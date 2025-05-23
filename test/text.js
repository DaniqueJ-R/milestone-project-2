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
const radioButtons = document.querySelectorAll('input[name="playlist-type"]');
let accessToken = null; // make it a global variable
let device_id = window.device_id || localStorage.getItem("spotify_device_id");
let trackUri = null;
const scopes = 
user-read-private
user-read-email
playlist-read-private
playlist-read-collaborative
user-top-read
user-library-read
streaming
user-read-playback-state
user-modify-playback-state

  .trim()
  .split(/\s+/)
  .join(" ");

//ensure accessToken gets initialized properly on load
// Skips log in if already logged in
window.onload = async function () {
  const token = localStorage.getItem("access_token");
  const expiresAt = localStorage.getItem("access_token_expires_at");

  if (token && expiresAt && Date.now() < parseInt(expiresAt)) {
    const valid = await isTokenValid(token);
    if (valid) {
      accessToken = token;
      console.log("✅ Access token is valid and not expired.");

      // Skip login step
      if (!window.location.href.includes("radio.html")) {
        document.location.href = "http://127.0.0.1:5501/radio.html";
        return;
      };
      
      if (window.Spotify) {
        initializePlayer(accessToken);
      } else {
        window.onSpotifyWebPlaybackSDKReady = () => {
          initializePlayer(accessToken);
        };
      }
      

      callPlaylists();
      return;
    } else {
      console.warn("⚠️ Token found but invalid, logging in again...");
    }
  } else {
    console.log("🔒 No valid token found, logging in...");
  }

  // Either no token or it's expired/invalid
  await logInWithSpotify();
};

//Calls all changed on mood buttons
document
  .getElementById("radioContainer")
  .addEventListener("click", callPlaylists);

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
  window.open("https://www.spotify.com/uk/signup");
  nextFunction();
}

function noLogIn() {
  alert("Please remeber if you don't log in, you will have limited use!");
  nextFunction();
}

// Attach signIn to the global window for inline HTML onclick usage.
async function logInWithSpotify() {
  const clientId = "d831bf8c8a594eaeb5d37469c14d13fe";
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  accessToken = localStorage.getItem("access_token");

  if (!accessToken || isTokenExpired()) {
    console.log("🔐 Access token expired or not found. Re-authenticating...");
    if (!code) {
      redirectToAuthCodeFlow(clientId);
      return;
    } else {
      accessToken = await getAccessToken(clientId, code);
      setTokenWithExpiration(accessToken, 3600); // Spotify token expires in 3600 seconds
      window.history.replaceState({}, document.title, "/"); // Clean URL
    }
  }

  console.log("✅ Access token valid:", accessToken);
  callPlaylists();
}

function isTokenExpired() {
  const expiresAt = localStorage.getItem("access_token_expires_at");
  return !expiresAt || Date.now() > parseInt(expiresAt);
}

function setTokenWithExpiration(token, expiresInSeconds) {
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  localStorage.setItem("access_token", token);
  localStorage.setItem("access_token_expires_at", expiresAt.toString());
}

async function isTokenValid(token) {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization:`Bearer ${token}`,
    },
  });
  return res.ok;
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
  params.append("redirect_uri", "http://127.0.0.1:5501/radio.html");
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

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);
  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://127.0.0.1:5501/radio.html");
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
  // Generate 128-character random string for outh code verifier
  // to be used in the authorization code flow.
}

// *** Step 1 Functions Log in End** //

// Step 2 Functions Radio Start //

function subMoodChanger() {
  // Always hide all sub-mood containers first
  document.querySelectorAll(".sub-mood").forEach((container) => {
    container.classList.add("hidden");
  });

  // Get selected main mood
  const selectedMainMood = document.querySelector(
    'input[name="playlist-type"]:checked'
  );

  // Show the matching sub-mood container
  if (selectedMainMood) {
    const moodType = selectedMainMood.value; // e.g., "focus"
    const subContainer = document.getElementById(`${moodType}-sub-options`);
    if (subContainer) {
      subContainer.classList.remove("hidden");
    }
  }
}

// Selecting mood for playlist
// This function will be called when the user selects a mood
function radioMood() {
  const radioButtons = document.querySelectorAll('input[name="playlist-type"]');
  const subButtons = document.querySelectorAll(
    'input[name="sub-playlist-type"]'
  );

  let selectedValue = null;
  let subValue = null;

  // Get selected main mood
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      selectedValue = radioButton.value;
      break;
    }
  }

  // Get selected sub-mood
  for (const subButton of subButtons) {
    if (subButton.checked) {
      subValue = subButton.value;
      break;
    }
  }

  // Reset/hide other sub-options
  subMoodChanger();

  // Check if both are selected and valid
  if (selectedValue && subValue) {
    alert(`You have selected: ${subValue} - ${selectedValue}`);

    if (playlistId[selectedValue] && playlistId[selectedValue][subValue]) {
      currentPlaylist = playlistId[selectedValue][subValue];
    } else {
      alert("That combo doesn't exist in the playlist.");
    }
  } else {
    alert("Please select a main mood and a sub mood.");
  }

  return { selectedValue, subValue };
}

//Matches mood to correct playlist
function getPlaylistId() {
  const mood = radioMood();
  if (!mood) return;

  const sessionKeywordMain = `${mood.selectedValue}.toLowerCase()`;
  const sessionKeywordSub = `${mood.subValue}.toLowerCase()`;
  const allPlaylists = playlistId;

  // 🔍 Log ALL playlists for debugging
  console.log("All playlists returned:", allPlaylists);

  const matchingPlaylists = playlistId[sessionKeywordMain]?.[sessionKeywordSub];

  console.log("Matching playlist:", matchingPlaylists);
  return matchingPlaylists;
}

// This function will be called when the user clicks the button to fetch songs
async function callPlaylists() {
  if (!accessToken) {
    console.error("Access token is missing!");
    return;
  }

  const selectedPlaylistId = getPlaylistId(); // This gets the correct ID

  if (selectedPlaylistId) {
    console.log("Selected playlist ID:", selectedPlaylistId);

    await fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    loadSong();
    return selectedPlaylistId;
  } else {
    console.log("No matching playlists found.");
    return null;
  }
}

//This finds each song in the playlist
async function fetchSongs(playlistId) {
  console.log("Selected playlist ID for fetchSong:", playlistId);
  const result = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    // https://api.spotify.com/v1/users/{user_id}/playlists/${playlistId}/tracks
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}`  },
    }
  );

  return await result.json();
}

async function loadSong(index = 0) {
  const currentPlaylistId = getPlaylistId();
  if (!currentPlaylistId) {
    console.error("No playlist ID found!");
    return;
  }

  const songsData = await fetchSongs(currentPlaylistId);
  const track = songsData.items[index]?.track;

  if (!track) {
    console.error("Track not found at index:", index);
    return;
  }

  let current = 0;
  document.getElementById("title").textContent = track.name;
  document.getElementById("artist-name").textContent = track.artists[0].name;
  // document.getElementById("audio").src = track.uri;
  document.getElementById("cover").src =
    track.album.images[0]?.url || "assets/images/favicon-32x32.png"; // handles missing image
  document.getElementById("spotifyLink").href = track.spotify;
  let trackUri = track.uri;
  console.log("Track fetched:", track.uri);
  document.getElementById("spotifyLink").href = track.external_urls.spotify;

  console.log("Now playing:", track);
  console.log("Calling playTrack with URI:", trackUri);
  playTrack(trackUri);
  return loadSong;
}

async function checkIfPremium() {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();
  if (data.product === "premium") {
    console.log("✅ You have Spotify Premium");
  } else {
    alert("⚠️ You need a Spotify Premium account to use playback.");
  }
}

//testing


// Initialize the player
// Only call this when you KNOW accessToken is valid and fresh
function initializePlayer(accessToken) {
window.onSpotifyWebPlaybackSDKReady = () => {
  const token = accessToken;
  console.log(`Access Token for playlback: ${accessToken}`)
  const player = new Spotify.Player({
    name: "Web Playback SDK Quick Start Player",
    getOAuthToken: (cb) => {
      cb(token);
    },
    volume: 0.5,
  });
  console.log(`Access Token for playlback: ${accessToken}`)

  // Ready
  player.addListener("ready", ({ device_id }) => {
    console.log("✅ Web Player ready with Device ID", device_id);
    localStorage.setItem("spotify_device_id", device_id);

    // Should call Device ID before needed below
    loadSong();
  });

  // Not Ready
  player.addListener("not_ready", ({ device_id }) => {
    console.log("Device ID has gone offline", device_id);
  });

  // Error handling
  player.addListener("initialization_error", ({ message }) => {
    console.error(message);
  });
  player.addListener("authentication_error", ({ message }) => {
    console.error(message);
  });
  player.addListener("account_error", ({ message }) => {
    console.error(message);
  });
  player.addListener("playback_error", ({ message }) => {
    console.error(message);
  });

  // document.getElementById('togglePlay').onclick = function() {
  //   player.togglePlay();
  // };

  player.connect();
};
};

async function playTrack(trackUri) {
  if (!device_id) {
    console.error("Missing device ID.");
    return;
  } else if (!accessToken) {
    console.error("Missing device access token.");
return;
  }


  console.log("Calling playTrack with URI in fnction:", trackUri);
  try {
    // First: Transfer playback to the Web Playback SDK
    await fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_ids: [device_id],
        play: false, // let us control when to play
      }),
    });

    // Second: Actually play the track
    const res = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [trackUri],
        }),
      }
    );

    if (res.status === 401) {
      console.error("❌ Unauthorized. Token may be expired.");
    } else if (res.status === 404) {
      console.warn("⚠️ Device Not Active Yet. Try interacting with the Spotify app first.");
      alert("Please press play on any Spotify device first, then try again.");
    } else if (!res.ok) {
      console.error("Something else went wrong:", await res.text());
    }
  } catch (error) {
    console.error("Playback error:", error);
  }
}


//testing

//Dragging slider
dragSlider(document.getElementById("slider-knob"));

function dragSlider(knob) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  // let container = knob.parentElement;
  let container = knob ? knob.parentElement : null;
  if (!container) return;
  // Set initial position of knob

  knob.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // Calculate new top position
    let newTop = knob.offsetTop - pos2;

    // Clamp within container
    newTop = Math.max(
      0,
      Math.min(container.clientHeight - knob.clientHeight, newTop)
    );

    knob.style.top = newTop + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
} //End of dragging slider

//Make slider volume control
function volumeControl() {
  const volumeSlider = document.getElementById("volume-slider");
  const audio = document.getElementById("audio");

  volumeSlider.addEventListener("input", function () {
    audio.volume = this.value / 100; // Set volume based on slider value (0-100)
  });
}

// nextBtn.addEventListener('click', () => {
//   currentIndex = (currentIndex + 1) % songs.length;
//   loadSong(currentIndex);
// });

// backBtn.addEventListener('click', () => {
//   currentIndex = (currentIndex - 1 + songs.length) % songs.length;
//   loadSong(currentIndex);
// });

//Makes vinyl clickable to play or pause song
function playPause() {
  let audio = document.getElementById("audio");
  let vinyl = document.getElementById("vinyl");
  if (audio.paused) {
    audio.pause();
    vinyl.classList.toggle("paused"); // Toggle paused if already spinning
  } else {
    audio.play();
    vinyl.classList.add("spinning"); // Start spinning if not already
  }
}









// Step 2 Functions Radio Start //

function subMoodChanger() {
  // Always hide all sub-mood containers first
  document.querySelectorAll(".sub-mood").forEach((container) => {
    container.classList.add("hidden");
  });

  // Get selected main mood
  const selectedMainMood = document.querySelector(
    'input[name="playlist-type"]:checked'
  );

  // Show the matching sub-mood container
  if (selectedMainMood) {
    const moodType = selectedMainMood.value; // e.g., "focus"
    const subContainer = document.getElementById(`${moodType}-sub-options`);
    if (subContainer) {
      subContainer.classList.remove("hidden");
    }
  }
}

// Selecting mood for playlist
// This function will be called when the user selects a mood
function radioMood() {
  const radioButtons = document.querySelectorAll('input[name="playlist-type"]');
  const subButtons = document.querySelectorAll(
    'input[name="sub-playlist-type"]'
  );

  let selectedValue = null;
  let subValue = null;

  // Get selected main mood
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      selectedValue = radioButton.value;
      break;
    }
  }

  // Get selected sub-mood
  for (const subButton of subButtons) {
    if (subButton.checked) {
      subValue = subButton.value;
      break;
    }
  }

  // Reset/hide other sub-options
  subMoodChanger();

  // Check if both are selected and valid
  if (selectedValue && subValue) {
    alert(`You have selected: ${subValue} - ${selectedValue}`);

    if (playlistId[selectedValue] && playlistId[selectedValue][subValue]) {
      currentPlaylist = playlistId[selectedValue][subValue];
    } else {
      alert("That combo doesn't exist in the playlist.");
    }
  } else {
    alert("Please select a main mood and a sub mood.");
  }

  return { selectedValue, subValue };
}

//Matches mood to correct playlist
function getPlaylistId() {
  const mood = radioMood();
  if (!mood) return;

  const sessionKeywordMain = `${mood.selectedValue}`.toLowerCase();
  const sessionKeywordSub = `${mood.subValue}.toLowerCase()`;
  const allPlaylists = playlistId;

  // 🔍 Log ALL playlists for debugging
  console.log("All playlists returned:", allPlaylists);

  const matchingPlaylists = playlistId[sessionKeywordMain]?.[sessionKeywordSub];

  console.log("Matching playlist:", matchingPlaylists);
  return matchingPlaylists;
}

// This function will be called when the user clicks the button to fetch songs
async function callPlaylists() {
  if (!accessToken) {
    console.error("Access token is missing!");
    return;
  }

  const selectedPlaylistId = getPlaylistId(); // This gets the correct ID

  if (selectedPlaylistId) {
    console.log("Selected playlist ID:", selectedPlaylistId);

    await fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    loadSong();
    return selectedPlaylistId;
  } else {
    console.log("No matching playlists found.");
    return null;
  }
}

//This finds each song in the playlist
async function fetchSongs(playlistId) {
  console.log("Selected playlist ID for fetchSong:", playlistId);
  const result = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    // https://api.spotify.com/v1/users/{user_id}/playlists/${playlistId}/tracks
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}`  },
    }
  );

  return await result.json();
}

async function loadSong(index = 0) {
  const currentPlaylistId = getPlaylistId();
  if (!currentPlaylistId) {
    console.error("No playlist ID found!");
    return;
  }

  const songsData = await fetchSongs(currentPlaylistId);
  const track = songsData.items[index]?.track;

  if (!track) {
    console.error("Track not found at index:", index);
    return;
  }

  let current = 0;
  document.getElementById("title").textContent = track.name;
  document.getElementById("artist-name").textContent = track.artists[0].name;
  // document.getElementById("audio").src = track.uri;
  document.getElementById("cover").src =
    track.album.images[0]?.url || "assets/images/favicon-32x32.png"; // handles missing image
  document.getElementById("spotifyLink").href = track.spotify;
  let trackUri = track.uri;
  console.log("Track fetched:", track.uri);
  document.getElementById("spotifyLink").href = track.external_urls.spotify;

  console.log("Now playing:", track);
  console.log("Calling playTrack with URI:", trackUri);
  playTrack(trackUri);
  return loadSong;
}

async function checkIfPremium() {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();
  if (data.product === "premium") {
    console.log("✅ You have Spotify Premium");
  } else {
    alert("⚠️ You need a Spotify Premium account to use playback.");
  }
}