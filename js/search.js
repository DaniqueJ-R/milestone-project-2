const currentStep = 0;

function nextFunction() {
      addEventListener('click', () => {
          console.log(`Current step is now: ${currentStep}`);
      });
  }
  
  module.exports = { currentStep };