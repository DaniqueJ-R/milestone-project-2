const stepTracker = { currentStep: 0 };
const songList = [
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

  let nextPage = document.getElementById(`step${stepTracker.currentStep}`);
  if (nextPage) {
    nextPage.classList.add("active");
  }

  if (stepTracker.currentStep > 5) {
    // Assuming there are 3 steps (0, 1, 2) is actually 5 steps, update later
    stepTracker.currentStep = 5; // Prevent going beyond the last step
  }
}

function logInWithSpotify() {
  // Add your Spotify login logic here/ add API call to get user data
  // After successful login, call nextFunction to continue the sequence;
  window.open("https://accounts.spotify.com/en/login");
  nextFunction();
}

function signInWithSpotify() {
  window.open("https://www.spotify.com/uk/signup");
  nextFunction();
}

function noLogIn() {
  alert("Please remeber if you don't log in, you will have limited use!");
  nextFunction();
}

// This is all the functions for the search bar
let list = document.getElementById("list");
let icon = document.getElementById("icon");
let span = document.querySelector(".dropdown-text span");
let input = document.getElementById("search-input");

window.onload = function () {
  showListItems();
};

function showListItems() {
  let listItems = document.querySelectorAll(".dropdown-list-item");

  listItems.forEach((item) => {
    item.onclick = function (e) {
      //search input filter changing dropdown list items text
      span.innerText = e.target.innerText;

      if (e.target.innerText === "All") {
        //if the clicked item is All, set the search input filter to different string
        input.placeholder = "Search All Media...";
      } else {
        //if the clicked item is not All, set the search input filter to the clicked item
        input.placeholder = `Search in ${e.target.innerText}...`;
      }

      // Hide dropdown after selection
      showDropdown(e);
    };
  });
}

function showDropdown(e) {
  e.stopPropagation(); // Stop click from bubbling to window

  // Toggle dropdown visibility
  list.classList.toggle("show");

  // Rotate the arrow icon
  icon.style.transform =
    icon.style.transform === "rotate(180deg)"
      ? "rotate(0deg)"
      : "rotate(180deg)";

  // Setup outside click handler ONCE when dropdown is used
  window.onclick = function (evt) {
    const clickedInsideDropdown = evt.target.closest(".dropdown");

    // Close dropdown if clicked outside
    if (!clickedInsideDropdown) {
      list.classList.remove("show");
      icon.style.transform = "rotate(0deg)";
    }
  };
}

module.exports = {
  stepTracker,
  list,
  icon,
  span,
  input,
  songList,
  nextFunction,
  logInWithSpotify,
  signInWithSpotify,
  noLogIn,
  showDropdown,
  showListItems,
};
