function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

function generateBodyColor() {
  document.body.style.backgroundColor = `${getRandomHexColor()}`;
  localStorage.setItem(COLOR_KEY, document.body.style.backgroundColor);
}

const startBtnRef = document.querySelector('[data-start]');
const stopBtnRef = document.querySelector('[data-stop]');
const COLOR_KEY = 'body-background-color';
let intervalId;

startBtnRef.addEventListener('click', handleStartClick);
stopBtnRef.addEventListener('click', handleStopClick);
document.body.addEventListener('durationchange', () => {});

function handleStartClick(evt) {
  generateBodyColor();

  intervalId = setInterval(() => {
    generateBodyColor();
  }, 1000);

  evt.currentTarget.setAttribute('disabled', '');
}

function handleStopClick(evt) {
  startBtnRef.removeAttribute('disabled');
  clearInterval(intervalId);
}

document.body.style.backgroundColor = localStorage.getItem(COLOR_KEY);
