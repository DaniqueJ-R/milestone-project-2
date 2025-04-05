const stepTracker = { currentStep: 0 }


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

        if (stepTracker.currentStep > 2) { // Assuming there are 3 steps (0, 1, 2) is actually 5 steps, update later
            stepTracker.currentStep = 2; // Prevent going beyond the last step
        }
    }; 

function logInWithSpotify(){
    alert("pop up to log into spotify then continues sequence")
    // Add your Spotify login logic here/ add API call to get user data
    // After successful login, call nextFunction to continue the sequence;
    window.open("https://support.spotify.com/premium-close-account/");
    nextFunction()
};   

function signInWithSpotify(){
    alert("New tab to sign up for spotify")
    window.open("https://www.spotify.com/uk/signup");
    nextFunction()
};   

function noLogIn() {
    alert("Please remeber if you don't log in, you will have limited use!");
    nextFunction()
};  


module.exports = { stepTracker, nextFunction, logInWithSpotify, signInWithSpotify, noLogIn };
