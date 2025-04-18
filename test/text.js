
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
    id: "medit37i9dQZF1DXcBWIGoYBM5M",
    name: "Peaceful Meditation",
    description: "Relax and breathe",
    owner: { id: "spotify" },
  },
  {
    id: "focus37i9dQZF1DXcBWIGoYBM5M",
    name: "My Focus Mix",
    description: "Just for you",
    owner: { id: "spotify" },
  },
  {
    id: "exerc37i9dQZF1DXcBWIGoYBM5M",
    name: "Intense Workout Beats",
    description: "Pump it up",
    owner: { id: "spotify" },
  },
  {
    id: "study37i9dQZF1DXcBWIGoYBM5M",
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
return matchingPlaylists;

}

function callPlaylists() {
  const matchingPlaylists = handleMoodSelection();

  if (matchingPlaylists && matchingPlaylists.length > 0) {
    const playlistId = matchingPlaylists[0].id;
    console.log("Selected playlist ID:", playlistId);

    // ✅ Do the fetch here, now that you have the playlistId
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, { // send request
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
                 
    .then(res => res.json())    // parse JSON response
    .then(data => {             // do something with the data
      console.log(data);
    })
    .catch(err => {             // handle any errors
      console.error(err);
    });
  

    return playlistId;
  } else {
    console.log("No matching playlists found.");
    return null;
  }
}





