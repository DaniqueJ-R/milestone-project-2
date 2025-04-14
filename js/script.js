const stepTracker = { currentStep: 0 };
let songs = [
  (chill = [
    {
      title: "Novacaine",
      artist: "Shiloh Dynasty",
      cover:
        "https://lh3.googleusercontent.com/VQpkxX2T4PIJ5Im_bU93nNA9bMfa6RLa1uqsU0AWg2UKMb_4ba8YfGT6WjGsqCbsniQoBQoIRH9tiy4=w544-h544-l90-rj",
      preview:
        "https://rr1---sn-aigl6nl7.googlevideo.com/videoplayback?expire=1744530684&ei=nBj7Z_fGO8CDi9oPgP6j6Ak&ip=45.39.148.108&id=o-AN6ZFiTSv0aUD4upaj3cTt_ZZX745_KvUvD0SkOUtNPJ&itag=249&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&bui=AccgBcMPLhH4gVfkcXPM9KcPFjpo0S9Q5BrLyplUy7hY3-_1YzXvSEqmtaPtUcN5fXPd6z6hIKu7CPH6&vprv=1&svpuc=1&mime=audio%2Fwebm&ns=NfBpDLh8Cp8DmpY8k3hfzmkQ&rqh=1&gir=yes&clen=1104642&dur=161.421&lmt=1737912144734379&keepalive=yes&lmw=1&c=TVHTML5&sefc=1&txp=5532534&n=dNyvsDNQ8c8ulg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRgIhAN8Cfg1L7UeTP9CxiNN2afMo15oitH7J7WiIe-JUfTyRAiEAxPwNeZYeiTfY7ANN6nXOxlN4MsGonXQaEnGKNaS-mbE%3D&rm=sn-8xgn5uxa-4g567s,sn-8xgn5uxa-quhz7l,sn-4g5ezs7l&rrc=79,79,104&fexp=24350590,24350737,24350827,24350961,24351147,24351149,24351173,24351230,24351283,24351398,24351523,24351528,24351543,24351545,24351606,24351638&req_id=242a0c8f1cd7a3ee&rms=nxu,au&redirect_counter=3&cms_redirect=yes&cmsv=e&ipbypass=yes&met=1744509093,&mh=ei&mip=2.96.149.249&mm=30&mn=sn-aigl6nl7&ms=nxu&mt=1744508358&mv=u&mvi=1&pl=20&lsparams=ipbypass,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=ACuhMU0wRgIhAMjWH_XWj8CxLysdYLypynq4HG9ma9kShSByq7xZn9uVAiEA7gnygEdzeI4d49_ech_l3iPrYanhapsrE6gotSTVqw0%3Dhttps://p.scdn.co/mp3-preview/81f95dfb9ea839bc9e.mp3",
      spotify:
        "https://open.spotify.com/track/2OrucC3HEPmZpkaQ05Nx0V?si=ab10c6c164284d0b",
    },
    {
      title: "Drowsy",
      artist: "Banes-World",
      cover:
        "https://lh3.googleusercontent.com/N-4674Srxoc-XoG_DalwDCpaYUbdpX_5JkGdz4IwrEqD5ywmRAmlslUnxcEc3R5ZfnmctArpv4HNwj4=w544-h544-l90-rj",
      preview:
        "https://www.youtube.com/ptracking?html5=1&video_id=X3N7ElQ5a1E&cpn=5pBGhX1iikEnfYlU&ei=lBz7Z8r6Ks_DmLAPntHY4QM&ptk=youtube_single&oid=AGkWKx66r8C5DE0uHq_qyw&ptchn=nORkXUaoOk6u78qqGbZzqA&pltype=content",
      spotify:
        "https://open.spotify.com/track/6j5CGg09rZ0Vv2vlnMMMpV?si=3bbace628a104cf6",
    },
  ]),
  (angry = [
    {
      title: "Rage",
      artist: "Rico Nasty",
      cover:
        "https://lh3.googleusercontent.com/2m7S1V8GJ6b4W1w0zqjXkQ9fX2gk5xY5cG4H8n0vF7r9v3qV6zZlT7KZxL5vQyD2zGJ6d5sM2r9g=w544-h544-l90-rj",
      preview:
        "https://www.youtube.com/ptracking?html5=1&video_id=2m7S1V8GJ6b4W1w0zqjXkQ9fX2gk5xY5cG4H8n0vF7r9v3qV6zZlT7KZxL5vQyD2zGJ6d5sM2r9g&cpn=5pBGhX1iikEnfYlU&ei=lBz7Z8r6Ks_DmLAPntHY4QM&ptk=youtube_single&oid=AGkWKx66r8C5DE0uHq_qyw&ptchn=nORkXUaoOk6u78qqGbZzqA&pltype=content",
      spotify:
        "https://open.spotify.com/track/2vWBUC9djv6BtiGlmKiQaH?si=c00eafd560a44135",
    },
    {
      title: "D.N.A",
      artist: "Kendrick Lamar",
      cover:
        "https://lh3.googleusercontent.com/2m7S1V8GJ6b4W1w0zqjXkQ9fX2gk5xY5cG4H8n0vF7r9v3qV6zZlT7KZxL5vQyD2zGJ6d5sM2r9g=w544-h544-l90-rj",
      preview:
        "https://www.youtube.com/ptracking?html5=1&video_id=2m7S1V8GJ6b4W1w0zqjXkQ9fX2gk5xY5cG4H8n0vF7r9v3qV6zZlT7KZxL5vQyD2zGJ6d5sM2r9g&cpn=5pBGhX1iikEnfYlU&ei=lBz7Z8r6Ks_DmLAPntHY4QM&ptk=youtube_single&oid=AGkWKx66r8C5DE0uHq_qyw&ptchn=nORkXUaoOk6u78qqGbZzqA&pltype=content",
      spotify:
        "https://open.spotify.com/track/2vWBUC9djv6BtiGlmKiQaH?si=c00eafd560a44135",
    },
  ]),
  (somber = [
    {
      title: "Candles",
      artist: "Daughter",
      cover:
        "https://lh3.googleusercontent.com/2m7S1V8GJ6b4W1w0zqjXkQ9fX2gk5xY5cG4H8n0vF7r9v3qV6zZlT7KZxL5vQyD2zGJ6d5sM2r9g=w544-h544-l90-rj",
      preview:
        "https://www.youtube.com/ptracking?html5=1&video_id=2m7S1V8GJ6b4W1w0zqjXkQ9fX2gk5xY5cG4H8n0vF7r9v3qV6zZlT7KZxL5vQyD2zGJ6d5sM2r9g&cpn=5pBGhX1iikEnfYlU&ei=lBz7Z8r6Ks_DmLAPntHY4QM&ptk=youtube_single&oid=AGkWKx66r8C5DE0uHq_qyw&ptchn=nORkXUaoOk6u78qqGbZzqA&pltype=content",
      spotify:
        "https://open.spotify.com/track/2vWBUC9djv6BtiGlmKiQaH?si=c00eafd560a44135",
    },
    {
      title: "Night We Met",
      artist: "Lord Huron",
      cover:
        "https://lh3.googleusercontent.com/2m7S1V8GJ6b4W1w0zqjXkQ9fX2gk5xY5cG4H8n0vF7r9v3qV6zZlT7KZxL5vQyD2zGJ6d5sM2r9g=w544-h544-l90-rj",
      preview:
        "https://www.youtube.com/ptracking?html5=1&video_id=2m7S1V8GJ6b4W1w0zqjXkQ9fX2gk5xY5cG4H8n0vF7r9v3qV6zZlT7KZxL5vQyD2zGJ6d5sM2r9g&cpn=5pBGhX1iikEnfYlU&ei=lBz7Z8r6Ks_DmLAPntHY4QM&ptk=youtube_single&oid=AGkWKx66r8C5DE0uHq_qyw&ptchn=nORkXUaoOk6u78qqGbZzqA&pltype=content",
      spotify:
        "https://open.spotify.com/track/2vWBUC9djv6BtiGlmKiQaH?si=c00eafd560a44135",
    },
  ]),
  (happy = [
    {
      title: "I Can't Wait To Get There",
      artist: "The Weeknd",
      cover:
        "https://lh3.googleusercontent.com/2m7S1V8GJ6b4W1w0zqjXkQ9fX2gk5xY5cG4H8n0vF7r9v3qV6zZlT7KZxL5vQyD2zGJ6d5sM2r9g=w544-h544-l90-rj",
      preview:
        "https://www.youtube.com/ptracking?html5=1&video_id=2m7S1V8GJ6b4W1w0zqjXkQ9fX2gk5xY5cG4H8n0vF7r9v3qV6zZlT7KZxL5vQyD2zGJ6d5sM2r9g&cpn=5pBGhX1iikEnfYlU&ei=lBz7Z8r6Ks_DmLAPntHY4QM&ptk=youtube_single&oid=AGkWKx66r8C5DE0uHq_qyw&ptchn=nORkXUaoOk6u78qqGbZzqA&pltype=content",
      spotify:
        "https://open.spotify.com/track/2vWBUC9djv6BtiGlmKiQaH?si=c00eafd560a44135",
    },
    {
      title: "Von Dutch",
      artist: "Charlie XCX",
      cover:
        "https://lh3.googleusercontent.com/2m7S1V8GJ6b4W1w0zqjXkQ9fX2gk5xY5cG4H8n0vF7r9v3qV6zZlT7KZxL5vQyD2zGJ6d5sM2r9g=w544-h544-l90-rj",
      preview:
        "https://www.youtube.com/ptracking?html5=1&video_id=2m7S1V8GJ6b4W1w0zqjXkQ9fX2gk5xY5cG4H8n0vF7r9v3qV6zZlT7KZxL5vQyD2zGJ6d5sM2r9g&cpn=5pBGhX1iikEnfYlU&ei=lBz7Z8r6Ks_DmLAPntHY4QM&ptk=youtube_single&oid=AGkWKx66r8C5DE0uHq_qyw&ptchn=nORkXUaoOk6u78qqGbZzqA&pltype=content",
      spotify:
        "https://open.spotify.com/track/2vWBUC9djv6BtiGlmKiQaH?si=c00eafd560a44135",
    },
  ]),
];

function nextFunction() {
  let currentPage = document.getElementById(`step${stepTracker.currentStep}`);
  if (currentPage) {
    currentPage.classList.remove("active");
  }

  stepTracker.currentStep++;

  headerImage();

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

function logInWithSpotify() {
  // Add your Spotify login logic here/ add API call to get user data
  // After successful login, call nextFunction to continue the sequence;
  window.open("https://www.spotify.com/uk/signup");
  nextFunction();
  };

function signInWithSpotify() {
  window.open("https://www.spotify.com/uk/signup");
  nextFunction();
}

function noLogIn() {
  alert("Please remeber if you don't log in, you will have limited use!");
  nextFunction();
}

// const clientId = "d831bf8c8a594eaeb5d37469c14d13fe";
// const redirectUri = "http://localhost:5500/callback";
// const authEndpoint = "https://accounts.spotify.com/authorize";
// const scopes = [
//   "user-read-private",
//   "playlist-read-private",
//   "playlist-read-collaborative",
// ];

// function loginWithSpotify() {
//   window.open = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;
// }

// document
//   .querySelector(".btn--big")
//   .addEventListener("click", loginWithSpotify);

// document.getElementById("login").addEventListener("click", () => {
//   const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join('%20')}&show_dialog=true`;
//   window.location.href = authUrl;
// });

// window.addEventListener("load", () => {
//   const hash = window.location.hash;
//   if (hash) {
//     const params = new URLSearchParams(hash.substring(1));
//     const accessToken = params.get("access_token");

//     if (accessToken) {
//       fetch("https://api.spotify.com/v1/me/playlists", {
//         headers: {
//           Authorization: "Bearer " + accessToken
//         }
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           const output = document.getElementById("output");
//           output.innerHTML = "<h2>Your Playlists:</h2>";
//           data.items.forEach((playlist) => {
//             output.innerHTML += `<p>${playlist.name}</p>`;
//           });
//         })
//         .catch((err) => {
//           console.error("Error fetching playlists", err);
//         });
//     }
//   }
// });

//STEP 2 Functions
//Dragging slider
dragSlider(document.getElementById("slider-knob"));

function dragSlider(knob) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  let container = knob.parentElement;

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
}

//Make slider volume control
function volumeControl() {
  const volumeSlider = document.getElementById("volume-slider");
  const audio = document.getElementById("audio");

  volumeSlider.addEventListener("input", function () {
    audio.volume = this.value / 100; // Set volume based on slider value (0-100)
  });
}

let current = 0;

// Load song info to player 
function loadSong(index) {
  const song = songs[index];
  document.getElementById("title").textContent = song.title;
  document.getElementById("artist-name").textContent = song.artist;
  document.getElementById("cover").src = song.cover;
  document.getElementById("audio").src = song.preview;
  document.getElementById("spotifyLink").href = song.spotify;
}

document.getElementById("next").addEventListener("click", () => {
  current = (current + 1) % songs.length;
  loadSong(current);
});

function radioMood() {
  const radioButtons = document.querySelectorAll('input[name="playlist-type"]');
  let selectedValue = null;
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      selectedValue = radioButton.value;
      break;
    }
  }

  
  if (selectedValue === "happy") {
    alert(`You have selected: ${selectedValue}`);
    songs = happy;
  } else if (selectedValue === "chill") {
    alert(`You have selected: ${selectedValue}`);
    songs = chill;
  } else if (selectedValue === "angry") {
    alert(`You have selected: ${selectedValue}`);
    songs = angry;
  } else if (selectedValue === "somber") {
    alert(`You have selected: ${selectedValue}`);
    songs = somber;
  } else {
    alert("Please select a mood.");
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
  radioMood,
};
