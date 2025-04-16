const stepTracker = { currentStep: 0 };


function nextFunction() {
  let currentPage = document.getElementById(`step${stepTracker.currentStep}`);
  if (currentPage) {
    currentPage.classList.remove("active");
  }

  stepTracker.currentStep++;

  // headerImage();

  let nextPage = document.getElementById(`step${stepTracker.currentStep}`);
  if (nextPage) {
    nextPage.classList.add("active");
  }

  if (stepTracker.currentStep > 5) {
    // Assuming there are 3 steps (0, 1, 2) is actually 5 steps, update later
    stepTracker.currentStep = 5; // Prevent going beyond the last step
  }
}

// function headerImage() {
//   let headerImage = document.getElementById("header-image");
//   if (stepTracker.currentStep === 2) {
//     headerImage.classList.remove("active");
//   } else {
//     headerImage.classList.add("active");
//   }
// }

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
// Add your Spotify login logic here/ add API call to get user data
// After successful login, call nextFunction to continue the sequence;
async function logInWithSpotify() {
  const clientId = "d831bf8c8a594eaeb5d37469c14d13fe";
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  console.log("signIn function called");

  if (!code) {
    redirectToAuthCodeFlow(clientId);
  } else {
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    populateUI(profile);
  }
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
  params.append("scope", "user-read-private user-read-email");
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



let currentPlaylist = []; // this will hold the selected mood's song array
let current = 0;

function loadSong(index) {
  const song = currentPlaylist[index];
  if (!song) return;

  document.getElementById("title").textContent = song.title;
  document.getElementById("artist-name").textContent = song.artist;
  document.getElementById("cover").src = song.cover;
  document.getElementById("audio").src = song.preview;
  document.getElementById("spotifyLink").href = song.spotify;
}

// Initial load
loadSong(current);

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
    currentPlaylist = songs[selectedValue]; // assign the song list
    // current = 0;
    
  } else {
    alert("Please select a mood.");
  }
  return selectedValue; 
}

// This function will be called when the user clicks the button to fetch playlists
async function fetchPlaylists(token) {
  const result = await fetch(
    "https://api.spotify.com/v1/me/playlists?limit=100",
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return await result.json();
}




// Simulated list of playlists from the Spotify API
const playlists = [
  {
    name: "Peaceful Meditation",
    description: "Relax and breathe",
    owner: { id: "spotify" },
  },
  {
    name: "My Focus Mix",
    description: "Just for you",
    owner: { id: "spotify" },
  },
  {
    name: "Intense Workout Beats",
    description: "Pump it up",
    owner: { id: "spotify" },
  },
  {
    name: "Cool school Session",
    description: "Hit the books and Study hard",
    owner: { id: "spotify" },
  },

];

// This function will be called when the user selects a mood
// and clicks the button to fetch playlists
function handleMoodSelection() {
  const mood = radioMood(); // will return the selected value

  if (!mood) return;

  const sessionKeyword = mood.toLowerCase(); // just in case it's not lowercase

  const matchingPlaylists = playlists.filter((playlist) => {
    const name = playlist.name.toLowerCase();
    const desc = playlist.description?.toLowerCase() || "";

    return (
      playlist.owner.id === "spotify" &&
      (name.includes(sessionKeyword) || desc.includes(sessionKeyword))
    );
  });

  console.log("Matching playlists:", matchingPlaylists);
}













function nextSong() {
  current = (current + 1) % currentPlaylist.length;
  loadSong(current);
}

function prevSong() {
  current = (current - 1 + currentPlaylist.length) % currentPlaylist.length;
  loadSong(current);
}

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

function songList() {
  const songListElement = document.getElementById("song-list");
  songListElement.innerHTML = ""; // Clear existing list

  currentPlaylist.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} - ${song.artist}`;
    li.addEventListener("click", () => loadSong(index));
    songListElement.appendChild(li);
  });
}

async function fetchProfile(token) {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return await result.json();
}





module.exports = {
  stepTracker,
  songList,
  nextFunction,
  headerImage,
  logInWithSpotify,
  signInWithSpotify,
  noLogIn,
  radioMood,
};






function populateUI(profile) {
  document.getElementById("displayName").innerText = profile.display_name;
  if (profile.images && profile.images[0]) {
    const profileImage = new Image(200, 200);
    profileImage.src = profile.images[0].url;
    document.getElementById("avatar").appendChild(profileImage);
    document.getElementById("imgUrl").innerText = profile.images[0].url;
  }
  document.getElementById("id").innerText = profile.id;
  document.getElementById("email").innerText = profile.email;
  document.getElementById("followers").innerText = profile.followers.total;
  document.getElementById("uri").innerText = profile.uri;
  document
    .getElementById("uri")
    .setAttribute("href", profile.external_urls.spotify);
  document.getElementById("url").innerText = profile.href;
  document.getElementById("url").setAttribute("href", profile.href);
}