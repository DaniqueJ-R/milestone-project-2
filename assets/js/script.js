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

//ECalls all changed on mood buttons
document.getElementById("nextPageIntro").addEventListener("click", nextFunction); //tick

function nextFunction() { //tick
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

document.getElementById("signInWithSpotify").addEventListener("click", signInWithSpotify); //tick

function signInWithSpotify() {
  window.open("https://www.spotify.com/uk/signup");
  nextFunction();
}

document.getElementById("noLogIn").addEventListener("click", noLogIn); //tick
function noLogIn() {
  alert("Please remeber if you don't log in, you will have limited use!");
  nextFunction();
}

        // Attach signIn to the global window for inline HTML onclick usage.

document.getElementById("logInWithSpotify").addEventListener("click", logInWithSpotify); //tick

async function logInWithSpotify() {
  const clientId = "d831bf8c8a594eaeb5d37469c14d13fe";
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  console.log("signIn function called");
      
          if (!code) {
      redirectToAuthCodeFlow(clientId);
      return;
          } else {
            const accessToken = await getAccessToken(clientId, code);
            const profile = await fetchProfile(accessToken);
            populateUI(profile);
          }
        };
      
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
      
        async function fetchProfile(token) {
          const result = await fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
          return await result.json();
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
        }
      
        async function generateCodeChallenge(codeVerifier) {
          const data = new TextEncoder().encode(codeVerifier);
          const digest = await window.crypto.subtle.digest("SHA-256", data);
          return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
        }
      
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
          document.getElementById("country").innerText = profile.country;
          document.getElementById("product").innerText = profile.product;
          document.getElementById("type").innerText = profile.type;
          document.getElementById("uri").innerText = profile.uri;
          document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
          document.getElementById("url").innerText = profile.href;
          document.getElementById("url").setAttribute("href", profile.href);
        }

//ensure accessToken gets initialized properly on load
// // Skips log in if already logged in
// async function authenticationProcess() {
//   const token = localStorage.getItem("access_token");
//   const expiresAt = localStorage.getItem("access_token_expires_at");

//   if (token && expiresAt && Date.now() < parseInt(expiresAt)) {
//     const valid = await isTokenValid(token);
//     if (valid) {
//       accessToken = token;
//       console.log("✅ Access token is valid and not expired.");

//       // Skip login step
//       if (!window.location.href.includes("radio.html")) {
//         document.location.href = "http://127.0.0.1:5501/radio.html";
// // populateUI(profile);
//         return;
//       };
      
//       // if (window.Spotify) {
//       //   initializePlayer(accessToken);
//       // } else {
//       //   window.onSpotifyWebPlaybackSDKReady = () => {
//       //     initializePlayer(accessToken);
//       //   };
//       // }
      

//       // populateUI(profile);
//       return;
//     } else {
//       console.warn("⚠️ Token found but invalid, logging in again...");
//     }
//   } else {
//     console.log("🔒 No valid token found, logging in...");
//   }

//   // Either no token or it's expired/invalid
//   await logInWithSpotify();
// };

// // document.getElementById("login-btn")
// // .addEventListener("click", populateUI);

// //Calls all changed on mood buttons
// // document
// //   .getElementById("radioContainer")
// //   .addEventListener("click", callPlaylists);

// function nextFunction() {
//   let currentPage = document.getElementById(`step${stepTracker.currentStep}`);
//   if (currentPage) {
//     currentPage.classList.add("hidden");
//   }

//   stepTracker.currentStep++;

//   let nextPage = document.getElementById(`step${stepTracker.currentStep}`);
//   if (nextPage) {
//     nextPage.classList.remove("hidden");
//   }

//   if (stepTracker.currentStep > 5) {
//     stepTracker.currentStep = 5; // Prevent going beyond the last step
//   }
// }



// // Attach signIn to the global window for inline HTML onclick usage.
// async function logInWithSpotify() {
//   const clientId = "d831bf8c8a594eaeb5d37469c14d13fe";
//   const params = new URLSearchParams(window.location.search);
//   const code = params.get("code");
//   console.log("signIn function called");

//   accessToken = localStorage.getItem("access_token");

//   if (!accessToken || isTokenExpired()) {
//     console.log("🔐 Access token expired or not found. Re-authenticating...");
//     if (!code) {
//       redirectToAuthCodeFlow(clientId);
//       return;
//     } else {
//       accessToken = await getAccessToken(clientId, code);
//       setTokenWithExpiration(accessToken, 3600); // Spotify token expires in 3600 seconds
//       window.history.replaceState({}, document.title, "/"); // Clean URL
//       // const profile = await fetchProfile(accessToken);
//       // populateUI(profile);
//     }
//   }

//   console.log("✅ Access token valid:", accessToken);
//   // populateUI()
// }

// function isTokenExpired() {
//   const expiresAt = localStorage.getItem("access_token_expires_at");
//   return !expiresAt || Date.now() > parseInt(expiresAt);
// }

// function setTokenWithExpiration(token, expiresInSeconds) {
//   const expiresAt = Date.now() + expiresInSeconds * 1000;
//   localStorage.setItem("access_token", token);
//   localStorage.setItem("access_token_expires_at", expiresAt.toString());
// }

// async function isTokenValid(token) {
//   const res = await fetch("https://api.spotify.com/v1/me", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return res.ok;
// }

// async function getAccessToken(clientId, code) {
//   const verifier = localStorage.getItem("verifier");
//   console.log("Verifier loaded:", verifier);
//   console.log("Code received:", code);

//   if (!verifier || !code) {
//     console.error("Missing verifier or code");
//     return;
//   }

//   const params = new URLSearchParams();
//   params.append("client_id", clientId);
//   params.append("grant_type", "authorization_code");
//   params.append("code", code);
//   params.append("redirect_uri", "http://127.0.0.1:5501/radio.html");
//   params.append("code_verifier", verifier);

//   const result = await fetch("https://accounts.spotify.com/api/token", {
//     method: "POST",
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     body: params,
//   });

//   const responseText = await result.text();
//   console.log("Token response", responseText);
//   const data = JSON.parse(responseText);

//   if (data.error) {
//     console.error("Error obtaining token:", data.error_description);
//     // Re-initiate the auth flow if the authorization code has expired
//     redirectToAuthCodeFlow(clientId);
//     return;
//   }
//   return data.access_token;
// }

// async function generateCodeChallenge(codeVerifier) {
//   const data = new TextEncoder().encode(codeVerifier);
//   const digest = await window.crypto.subtle.digest("SHA-256", data);
//   return btoa(String.fromCharCode(...new Uint8Array(digest)))
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=+$/, "");
// }

// async function redirectToAuthCodeFlow(clientId) {
//   const verifier = generateCodeVerifier(128);
//   const challenge = await generateCodeChallenge(verifier);
//   localStorage.setItem("verifier", verifier);

//   const params = new URLSearchParams();
//   params.append("client_id", clientId);
//   params.append("response_type", "code");
//   params.append("redirect_uri", "http://127.0.0.1:5501/radio.html");
//   params.append("scope", scopes);
//   params.append("code_challenge_method", "S256");
//   params.append("code_challenge", challenge);

//   document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
// }

// function generateCodeVerifier(length) {
//   let text = "";
//   let possible =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   for (let i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
//   // Generate 128-character random string for outh code verifier
//   // to be used in the authorization code flow.
// }

// // *** Step 1 Functions Log in End** //

// // Step 2 - Profile functions//

// async function fetchProfile(token) {
//   const result = await fetch("https://api.spotify.com/v1/me", {
//     method: "GET",
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   console.log("Access token being used:", accessToken);
//   return await result.json();
// }

// function populateUI(profile) {

//   // fetchProfile(token)

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


// // onclick - ontinue from profile - callPlaylists();
// // on click - wrong account - logInWithSpotify