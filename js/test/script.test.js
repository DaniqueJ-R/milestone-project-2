const {
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
  showDropdown,
showListItems,
searchSong,
} = require("../script.js"); 

beforeEach(() => {
  // Set up the initial DOM state for each test
  stepTracker.currentStep = 0; // Reset currentStep before each test
  document.body.innerHTML = `
          <div id="step0" class="active">Step 0</div>
          <div id="step1" class="page">Step 1</div>
          <div id="step2" class="page">Step 2</div>
          <button id="nextButton">Next</button>
      `;
});

afterEach(() => {
  stepTracker.currentStep = 0;
  document.body.innerHTML = "";
});

describe("currentStep to show correct number", () => {
  test("currentStep should be set to 0", () => {
    expect(stepTracker.currentStep).toEqual(0);
  });
});

describe("nextFunction working correctly", () => {

  beforeEach(() => {
    stepTracker.currentStep = 0; // reset to start each test fresh
  
    document.body.innerHTML = `
      <div id="step0" class="step active">Step 1</div>
      <div id="step1" class="step">Step 2</div>
      <div id="step2" class="step">Step 3</div>
      <div id="step3" class="step">Step 4</div>
      <div id="header-image" class="active">Header Image</div>
    `;
  });
  

  test("nextFunction should find the current step element", () => {
    let currentPage = document.getElementById(`step${stepTracker.currentStep}`);
    expect(currentPage).not.toBeNull();
  });

  test("nextFunction should remove active class from current step", () => {
    let currentPage = document.getElementById(`step${stepTracker.currentStep}`);
    expect(currentPage.classList.contains("active")).toBe(true);
    nextFunction();
    expect(currentPage.classList.contains("active")).toBe(false);
  });

  test("nextFunction should remove active class from header-image at step 2", () => {
    stepTracker.currentStep = 2; // Set to step 2
    headerImage(); // Call headerImage function
    let headerImageElement = document.getElementById("header-image");
    expect(headerImageElement.classList.contains("active")).toBe(false);
  });

  test("nextFunction should increment currentStep", () => {
    nextFunction();
    expect(stepTracker.currentStep).toEqual(1);
  });

  test("nextFunction should add active class to next step", () => {
    nextFunction();
    let nextPage = document.getElementById(`step${stepTracker.currentStep}`);
    expect(nextPage.classList.contains("active")).toBe(true);
  });

  test("nextFunction should not exceed the number of steps", () => {
    stepTracker.currentStep = 5; // Set to the last step
    nextFunction(); // Call nextFunction to try to go to the next step
    expect(stepTracker.currentStep).toEqual(5); // Should not exceed the last step
  });
});



describe("noLogIn function conntinues sequence correctly", () => {
  beforeEach(() => {
    stepTracker.currentStep = 0; // Reset currentStep before each test
    document.body.innerHTML = `
                <button onclick="noLogIn()">Next</button>
            `;
  });

  test("noLogIn should alert the user", () => {
    global.alert = jest.fn(); // Mock the alert function
    noLogIn();
    expect(global.alert).toHaveBeenCalledWith(
      "Please remeber if you don't log in, you will have limited use!"
    );
  });

  test("noLogIn should call nextFunction", () => {
    noLogIn();
    expect(global.alert).toHaveBeenCalled(nextFunction());
  });

  test("noLogIn should call nextFunction", () => {
    global.alert = jest.fn(); // Still mock alert
  
    // Mock nextFunction
    global.nextFunction = jest.fn();
  
    // Run your function
    noLogIn();
  
    // Now check if nextFunction was called
    expect(global.nextFunction).toHaveBeenCalled();
  });
});




describe("logInWithSpotify function conntinues sequence correctly", () => {
  beforeEach(() => {
    stepTracker.currentStep = 0;
    document.body.innerHTML = `
                <button onclick="logInWithSpotify()">Next</button>
            `;
  });

  test("logInWithSpotify should call nextFunction", () => {
    logInWithSpotify();
    expect(global.alert).toHaveBeenCalled(nextFunction());
  });

  test("logInWithSpotify should open new tab/popup to log in", () => {
    window.open = jest.fn();
    logInWithSpotify();
    expect(window.open).toHaveBeenCalledTimes(1);
  });
});

describe("signInWithSpotify function conntinues sequence correctly", () => {
  beforeEach(() => {
    stepTracker.currentStep = 0;
    document.body.innerHTML = `
                <button onclick="logInWithSpotify()">Next</button>
            `;
  });

  test("signInWithSpotify should call nextFunction", () => {
    signInWithSpotify();
    expect(global.alert).toHaveBeenCalled();
  });

  test("signInWithSpotify should open new tab/popup to log in", () => {
    window.open = jest.fn();
    signInWithSpotify();
    expect(window.open).toHaveBeenCalledTimes(1);
  });
});
