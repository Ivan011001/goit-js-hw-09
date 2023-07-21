import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const inputRef = document.querySelector('#datetime-picker');
const startBtnRef = document.querySelector('[data-start]');
const ouputRefs = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let intervalId;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      startBtnRef.disabled = true;
      return Notify.failure('Please choose a date in the future', {
        timeout: 1500,
      });
    }

    startBtnRef.disabled = false;

    startBtnRef.addEventListener('click', startButtonActive);

    function startButtonActive() {
      startBtnRef.disabled = true;
      inputRef.disabled = true;

      setCurrentTime(selectedDates[0]);
      intervalId = setInterval(() => {
        setCurrentTime(selectedDates[0]);
      }, 1000);
    }
  },
};

const fp = flatpickr(inputRef, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function setCurrentTime(futureTime) {
  const timeData = convertMs(futureTime - Date.now());
  addLeadingZero(timeData);

  isTimerOver(convertMs(futureTime - Date.now()));
}

function addLeadingZero(value) {
  ouputRefs.days.textContent = value.days.toString().padStart(2, '0');
  ouputRefs.hours.textContent = value.hours.toString().padStart(2, '0');
  ouputRefs.minutes.textContent = value.minutes.toString().padStart(2, '0');
  ouputRefs.seconds.textContent = value.seconds.toString().padStart(2, '0');
}

function isTimerOver({ days, hours, minutes, seconds }) {
  if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    clearInterval(intervalId);
    Notify.info('Your timer is over', {
      timeout: 1500,
    });
    inputRef.disabled = false;
  }
}
