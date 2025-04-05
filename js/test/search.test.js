const { stepTracker, nextFunction, noLogIn} = require("../search.js");

describe("currentStep to show correct number", () => {
  test("currentStep should be set to 0", () => {
    expect(stepTracker.currentStep).toEqual(0);
  });
});

describe("nextFunction working correctly", () => {
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
        stepTracker.currentStep = 1; // Reset currentStep before each test
        document.body.innerHTML = `
                <div id="step0" class="active">Step 0</div>
                <div id="step1" class="page">Step 1</div>
                <div id="step2" class="page">Step 2</div>
                <button id="nextButton">Next</button>
            `;
    });
    
    
    test("noLogIn should alert the user", () => {
        global.alert = jest.fn(); // Mock the alert function
        noLogIn();
        expect(global.alert).toHaveBeenCalledWith("{Pleasae remeber if you don't log in, you will have limited use!");
    });
    });