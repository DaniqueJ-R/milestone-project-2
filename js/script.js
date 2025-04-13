const stepTracker = { currentStep: 0 };
let songList = [
  { title: "Shape of You", artist: "Ed Sheeran" },
  { title: "Blinding Lights", artist: "The Weeknd" },
  { title: "Levitating", artist: "Dua Lipa" },
  { title: "Someone Like You", artist: "Adele" },
  { title: "Rolling in the Deep", artist: "Adele" },
  { title: "Old Town Road", artist: "Lil Nas X" },
  { title: "Stay", artist: "Justin Bieber" },
];


function nextFunction() {
  let currentPage = document.getElementById(`step${stepTracker.currentStep}`);
  if (currentPage) {
    currentPage.classList.remove("active");
  }

  stepTracker.currentStep++;

  headerImage()

  let nextPage = document.getElementById(`step${stepTracker.currentStep}`);
  if (nextPage) {
    nextPage.classList.add("active");
  }

  if (stepTracker.currentStep > 5) {
    // Assuming there are 3 steps (0, 1, 2) is actually 5 steps, update later
    stepTracker.currentStep = 5; // Prevent going beyond the last step
  }
}

function headerImage() {
  let headerImage = document.getElementById("header-image");
  if (stepTracker.currentStep === 2) {
    headerImage.classList.remove("active");
  } else {
    headerImage.classList.add("active");
  }
}

// function logInWithSpotify() {
  // Add your Spotify login logic here/ add API call to get user data
  // After successful login, call nextFunction to continue the sequence;
    // window.location = ${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
      // "%20"
    // )}&response_type=token&show_dialog=true;
  // };
  // nextFunction();
// }

function signInWithSpotify() {
  window.open("https://www.spotify.com/uk/signup");
  nextFunction();
}

function noLogIn() {
  alert("Please remeber if you don't log in, you will have limited use!");
  nextFunction();
}

const clientId = "d831bf8c8a594eaeb5d37469c14d13fe";
const redirectUri = "http://localhost:5500/callback";
const authEndpoint = "https://accounts.spotify.com/authorize";
const scopes = [
  "user-read-private",
  "playlist-read-private",
  "playlist-read-collaborative"
];

function loginWithSpotify() {
  window.open = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;
}

// document
//   .querySelector(".btn--big")
//   .addEventListener("click", loginWithSpotify);



document.getElementById("login").addEventListener("click", () => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join('%20')}&show_dialog=true`;
  window.location.href = authUrl;
});

window.addEventListener("load", () => {
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");

    if (accessToken) {
      fetch("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      })
        .then((res) => res.json())
        .then((data) => {
          const output = document.getElementById("output");
          output.innerHTML = "<h2>Your Playlists:</h2>";
          data.items.forEach((playlist) => {
            output.innerHTML += `<p>${playlist.name}</p>`;
          });
        })
        .catch((err) => {
          console.error("Error fetching playlists", err);
        });
    }
  }
});

//Dragging slider for step2 radio
dragElement(document.getElementById("mydiv"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let initialY = 0; // Store the initial Y position

  if (document.getElementById(elmnt.id)) {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    initialY = elmnt.offsetTop; // Store the initial Y position
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // Calculate the new Y position, constrained to 50px above and below the initial position
    let newY = elmnt.offsetTop - pos2;
    newY = Math.max(initialY - 50, Math.min(initialY + 50, newY));  //Clamp the value

    // set the element's new position:
    elmnt.style.top = newY + "px";
    elmnt.style.left = elmnt.offsetLeft + "px"; // Keep the left position the same
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}





module.exports = {
  stepTracker,
  list,
  icon,
  span,
  input,
  songList,
  nextFunction,
  headerImage,
  logInWithSpotify,
  signInWithSpotify,
  noLogIn,
};
