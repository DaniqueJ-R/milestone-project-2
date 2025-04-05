const {  stepTracker, nextFunction, logInWithSpotify, signInWithSpotify, noLogIn } = require("../search.js");

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

  test("nextFunction should increment currentStep", () => {
    nextFunction();
    expect(stepTracker.currentStep).toEqual(1);
  });

  test("nextFunction should add active class to next step", () => {
    nextFunction();
    let nextPage = document.getElementById(`step${stepTracker.currentStep}`);
    expect(nextPage.classList.contains("active")).toBe(true);
  });
});

test("nextFunction should not exceed the number of steps", () => {
  stepTracker.currentStep = 2; // Set to the last step
  nextFunction(); // Call nextFunction to try to go to the next step
  expect(stepTracker.currentStep).toEqual(2); // Should not exceed the last step
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
        expect(global.alert).toHaveBeenCalledWith("Please remeber if you don't log in, you will have limited use!");
    });

    test("noLogIn should call nextFunction", () => {
      noLogIn();
      expect(global.alert).toHaveBeenCalled(); 
      });

    });

    describe("logInWithSpotify function conntinues sequence correctly", () => {
      beforeEach(() => {
        stepTracker.currentStep = 0;
        document.body.innerHTML = `
                <button onclick="logInWithSpotify()">Next</button>
            `;
    });
    
    test("logInWithSpotify should alert the user", () => {
        global.alert = jest.fn(); 
        logInWithSpotify();
        expect(global.alert).toHaveBeenCalledWith("pop up to log into spotify then continues sequence");
    });

    test("logInWithSpotify should call nextFunction", () => {
      logInWithSpotify();
      expect(global.alert).toHaveBeenCalled(); 
      });

      test("logInWithSpotify should open new tab/popup to log in", () => {
        window.open = jest.fn()
        logInWithSpotify();
        expect(window.open).toHaveBeenCalledTimes(1)

      });
    });

    
    describe("signInWithSpotify function conntinues sequence correctly", () => {
      beforeEach(() => {
        stepTracker.currentStep = 0;
        document.body.innerHTML = `
                <button onclick="logInWithSpotify()">Next</button>
            `;
    });
    
    test("signInWithSpotify should alert the user", () => {
        global.alert = jest.fn(); 
        signInWithSpotify();
        expect(global.alert).toHaveBeenCalledWith("New tab to sign up for spotify");
    });

    test("signInWithSpotify should call nextFunction", () => {
      signInWithSpotify();
      expect(global.alert).toHaveBeenCalled(); 
      });

      test("signInWithSpotify should open new tab/popup to log in", () => {
        window.open = jest.fn()
        signInWithSpotify();
        expect(window.open).toHaveBeenCalledTimes(1)

      });
    });