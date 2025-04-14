const {
  stepTracker,
  parentElement,
  songList,
  nextFunction,
  headerImage,
  logInWithSpotify,
  signInWithSpotify,
  noLogIn,
  radioMood,
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

describe("noLogIn function continues sequence correctly", () => {
  beforeEach(() => {
    stepTracker.currentStep = 0;
    document.body.innerHTML = `<button onclick="noLogIn()">Next</button>`;
    global.alert = jest.fn(); // Reset alert mock
    global.nextFunction = jest.fn(); // Reset nextFunction mock
  });

  test("should alert the user", () => {
    noLogIn();
    expect(global.alert).toHaveBeenCalledWith(
      "Please remeber if you don't log in, you will have limited use!"
    );
  });

  test("should call nextFunction", () => {
    noLogIn();
    expect(global.nextFunction).toHaveBeenCalled();
  });
});

describe("logInWithSpotify function continues sequence correctly", () => {
  beforeEach(() => {
    stepTracker.currentStep = 0;
    document.body.innerHTML = `<button onclick="logInWithSpotify()">Next</button>`;
    window.open = jest.fn();
    global.nextFunction = jest.fn();
  });

  test("should call nextFunction", () => {
    logInWithSpotify();
    expect(global.nextFunction).toHaveBeenCalled();
  });

  test("should open new tab/popup to log in", () => {
    logInWithSpotify();
    expect(window.open).toHaveBeenCalledTimes(1);
  });
});

describe("signInWithSpotify function continues sequence correctly", () => {
  beforeEach(() => {
    stepTracker.currentStep = 0;
    document.body.innerHTML = `<button onclick="signInWithSpotify()">Next</button>`;
    window.open = jest.fn();
    global.nextFunction = jest.fn();
  });

  test("should open new tab/popup to log in", () => {
    signInWithSpotify();
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  test("should call nextFunction", () => {
    signInWithSpotify();
    expect(global.nextFunction).toHaveBeenCalled();
  });
});





beforeEach(() => {
  // Reset step tracker
  stepTracker.currentStep = 0;

  // Setup DOM
  document.body.innerHTML = `
    <div id="step0" class="active"></div>
    <div id="step1"></div>
    <div id="step2"></div>
    <div id="step3"></div>
    <div id="step4"></div>
    <div id="step5"></div>
    <div id="header-image" class="active"></div>
  `;
});

describe('Navigation Flow', () => {
  test('nextFunction increments step and updates classes', () => {
    nextFunction();

    expect(stepTracker.currentStep).toBe(1);

    const currentStep = document.getElementById('step0');
    const nextStep = document.getElementById('step1');

    expect(currentStep.classList.contains('active')).toBe(false);
    expect(nextStep.classList.contains('active')).toBe(true);
  });

  test('headerImage removes active class on step 2', () => {
    stepTracker.currentStep = 2;
    headerImage();

    const header = document.getElementById('header-image');
    expect(header.classList.contains('active')).toBe(false);
  });

  test('headerImage adds active class on steps other than 2', () => {
    stepTracker.currentStep = 3;
    headerImage();

    const header = document.getElementById('header-image');
    expect(header.classList.contains('active')).toBe(true);
  });

  test('step does not go beyond 5', () => {
    stepTracker.currentStep = 5;
    nextFunction();

    expect(stepTracker.currentStep).toBe(5); // doesn't increment past 5
  });

  test('logInWithSpotify opens Spotify and calls nextFunction', () => {
    window.open = jest.fn();

    logInWithSpotify();

    expect(window.open).toHaveBeenCalledWith("https://www.spotify.com/uk/signup");
    expect(stepTracker.currentStep).toBe(1);
  });

  test('signInWithSpotify works like login', () => {
    window.open = jest.fn();

    signInWithSpotify();

    expect(window.open).toHaveBeenCalledWith("https://www.spotify.com/uk/signup");
    expect(stepTracker.currentStep).toBe(1);
  });
});
