//Somewhere in codee the age will not pass the log in if already logged in and token is valid, please debug//

const stepTracker = { currentStep: 0 };
let accessToken = null; // make it a global variable
let playlistId = null;
// window.callPlaylists = callPlaylists;
const scopes = `
user-read-private
user-read-email
playlist-read-private
playlist-read-collaborative
user-top-read
user-library-read
`
  .trim()
  .split(/\s+/)
  .join(" ");

//ensure accessToken gets initialized properly on load
window.onload = async function () {
  const token = localStorage.getItem("access_token");
  if (token) {
    accessToken = token;
    console.log("Access token loaded from localStorage");
  } else {
    await logInWithSpotify(); // Ensure this updates the global token
  }
};

// window.onload = async function () {
//   const token = localStorage.getItem("access_token");
//   if (token) {
//     accessToken = token;
//     console.log("Access token loaded from localStorage");
//     console.log("Access token being used1:", accessToken);DELETE LATER
//     populateUI();
//     Validate token by hitting /me
//     const valid = await isTokenValid(token);
//     if (!valid) {
//       console.warn("Stored token is invalid, redirecting...");
//       redirectToAuthCodeFlow("d831bf8c8a594eaeb5d37469c14d13fe");
//     }
//   } else {
//     logInWithSpotify();
//   }
// };

function nextFunction() {
  let currentPage = document.getElementById(`step${stepTracker.currentStep}`);
  if (currentPage) {
    currentPage.classList.add("hidden");
  }

  stepTracker.currentStep++;

  // headerImage();

  let nextPage = document.getElementById(`step${stepTracker.currentStep}`);
  if (nextPage) {
    nextPage.classList.remove("hidden");
  }

  if (stepTracker.currentStep > 5) {
    // Assuming there are 3 steps (0, 1, 2) is actually 5 steps, update later
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

// window.onload = async function () {
//   const token = localStorage.getItem("access_token");
//   if (token) {
//     accessToken = token;
//     console.log("Access token loaded from localStorage");
//     // const profile = await fetchProfile(accessToken);
//     console.log("Access token being used1:", accessToken); DELETE LATER

//   } else {
//     logInWithSpotify();
//   }
// };

async function isTokenValid(token) {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
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

// step 2 Functions Radio Start //
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

//Select PLaylist mood



// Initial load
// loadSong(current);

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

// This function will be called when the user clicks the button to fetch playlists
async function fetchPlaylists(token) {
  const res = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: { Authorization: `Bearer ${token}` },
  });
  // const result = await fetch(
  //   // "https://api.spotify.com/v1/browse/categories/0JQ5DAt0tbjZptfcdMSKl3",DELETE LATER
  //   // "https://api.spotify.com/v1/browse/categories",DELETE LATER
  //   // 'https://api.spotify.com/v1/browse/categories/0JQ5DAt0tbjZptfcdMSKl3/playlists',  DELETE LATER
  //   // 'https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFFzDl7qN9Apr/playlists',DELETE LATER
  //   // 'https://api.spotify.com/v1/users/{user_id}/playlists', DELETE LATER
  //   'https://api.spotify.com/v1/me/playlists',
  //   {
  //     method: "GET",
  //     headers: { Authorization: `Bearer ${token}` },
  //   }
  // );

  if (res.status === 401) {
    console.warn("⚠️ Token expired. Reauthenticating...");
    localStorage.removeItem("access_token");
    localStorage.removeItem("access_token_expires_at");
    window.location.reload(); // Trigger login again
    return;
  }

  return await res.json();
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

async function callPlaylists() {
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
    })
      .then((res) => res.json()) // parse JSON response
      .then((data) => {
        // do something with the data
        console.log(data);
      })
      .catch((err) => {
        // handle any errors
        console.error(err);
      });
      loadSong()
    return playlistId;
  } else {
    console.log("No matching playlists found.");
    return null;
  }

}

// This function will be called when the user clicks the button to fetch songs
async function fetchSongs(playlistId) {
  console.log("Selected playlist ID for fetchSong:", playlistId);
  const result = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return await result.json();
}

// async function loadSong(index) {
//   const song = await fetchSongs(playlistId); // ← call and await playlist
//   let currentPlaylist = []; // this will hold the selected mood's song array
//   let current = 0;
//   if (!song) return;
//   document.getElementById("title").textContent = song.title;
//   document.getElementById("artist-name").textContent = song.artist;
//   document.getElementById("cover").src = song.cover;
//   document.getElementById("audio").src = song.preview;
//   document.getElementById("spotifyLink").href = song.spotify;
//   audio.play();
//   console.log("Playlist being used:", song);
// }

async function loadSong(index) {
  if (!playlistId) {
    console.error("No playlistId defined!");
    return;
  }

  const songsData = await fetchSongs(playlistId); // ← call and await playlist
  const track = songsData.items[0].track;
  console.log("Playlist being used:", songsData);
  if (!track) {
    console.error("Track not found at index:", index);
    return;
  }

  let current = 0;
  // if (!song) return;
  // document.getElementById("title").textContent = track.name;
  // document.getElementById("artist-name").textContent = track.artists;
  // document.getElementById("cover").src = song.cover;
  // document.getElementById("audio").src = song.preview;
  // document.getElementById("spotifyLink").href = song.spotify;
  // audio.play();
  // console.log("Playlist being used:", songsData);

  // title.textContent = track.name;
  // artist-name.textContent = track.artists//[0].name;


 document.getElementById("title").textContent = track.name;
  document.getElementById("artist-name").textContent = track.artists[0].name;

  audio.src = track.preview_url;
  cover.src = track.album.images[0]?.url || "assets/images/favicon-32x32.png"; // handle missing image
  audio.play();

  console.log("Now playing:", track);
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

//Profile functions+

// async function fetchProfile(token) {
//   const result = await fetch("https://api.spotify.com/v1/me", {
//     method: "GET",
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   console.log("Access token being used:", accessToken);
//   return await result.json();
// }

// function populateUI(profile) {
//   document.getElementById("displayName").innerText = profile.display_name;
//   if (profile.images && profile.images[0]) {
//     const profileImage = new Image(200, 200);
//     profileImage.src = profile.images[0].url;
//     document.getElementById("avatar").appendChild(profileImage);
//     document.getElementById("imgUrl").innerText = profile.images[0].url;
//   }
//   document.getElementById("id").innerText = profile.id;
//   document.getElementById("email").innerText = profile.email;
//   document.getElementById("followers").innerText = profile.followers.total;
//   document.getElementById("uri").innerText = profile.uri;
//   document
//     .getElementById("uri")
//     .setAttribute("href", profile.external_urls.spotify);
//   document.getElementById("url").innerText = profile.href;
//   document.getElementById("url").setAttribute("href", profile.href);
// }

// module.exports = {
//   stepTracker,
//   songList,
//   nextFunction,
//   headerImage,
//   logInWithSpotify,
//   signInWithSpotify,
//   noLogIn,
//   radioMood,
// };
