const { currentStep } = require("../search.js"); 

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
});

describe("currentStep to show correct number", () => {
    test("currentStep should be set to 0", () => {
        console.log(currentStep); 
        expect(currentStep).toEqual(0); 
    });
});
