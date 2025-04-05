const stepTracker = { currentStep: 0 }
    
// document.getElementById("nextButton").addEventListener("click", () => {
    // nextFunction();
    // });



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


function noLogIn() {
    alert("{Pleasae remeber if you don't log in, you will have limited use!");
    nextFunction()
}    


module.exports = { stepTracker, nextFunction, noLogIn };
