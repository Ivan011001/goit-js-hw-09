import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const timeRef = document.querySelector('#datetime-picker');
const buttonsRef = {
  start: document.querySelector('[data-start]'),
  reset: document.querySelector('[data-reset]'),
  stop: document.querySelector('[data-stop]'),
  resume: document.querySelector('[data-resume]'),
};
const outputsRef = {
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
    if (selectedDates[0] < Date.now()) {
      setCurrentTime(Date.now());
      return Notify.failure('Please choose a date in the future');
    }

    buttonsRef.start.disabled = false;
    buttonsRef.start.addEventListener('click', evt => {
      Notify.success('Your timer has started!');
      setCurrentTime(selectedDates[0]);

      intervalId = setInterval(() => {
        if (
          outputsRef.days.textContent === '00' &&
          outputsRef.hours.textContent === '00' &&
          outputsRef.minutes.textContent === '00' &&
          outputsRef.seconds.textContent === '06'
        ) {
          Notify.success('Your timer has almost ended!');
          setTimeout(() => {
            clearInterval(intervalId);
            location.reload();
          }, 5000);
        }

        setCurrentTime(selectedDates[0]);
      }, 1000);

      timeRef.disabled = true;
      buttonsRef.start.disabled = true;
      buttonsRef.stop.disabled = false;
    });

    buttonsRef.stop.addEventListener('click', evt => {
      Notify.warning('You have stopped the timer!');
      clearInterval(intervalId);
      setCurrentTime(selectedDates[0]);

      buttonsRef.resume.classList.toggle('resume-btn');
      buttonsRef.stop.disabled = true;
      buttonsRef.reset.disabled = false;
    });

    buttonsRef.resume.addEventListener('click', evt => {
      Notify.success('Your timer has started!');
      setCurrentTime(selectedDates[0]);
      intervalId = setInterval(() => {
        setCurrentTime(selectedDates[0]);
      }, 1000);

      buttonsRef.resume.classList.toggle('resume-btn');
      buttonsRef.stop.disabled = false;
      buttonsRef.reset.disabled = true;
    });

    buttonsRef.reset.addEventListener('click', evt => {
      Notify.info('You have reseted the timer!');
      buttonsRef.resume.classList.toggle('resume-btn');
      setCurrentTime(Date.now());
      buttonsRef.reset.disabled = true;
      timeRef.disabled = false;
      buttonsRef.start.disabled = false;
    });
  },
};
const fp = flatpickr(timeRef, options);

function setCurrentTime(selectedTime) {
  addLeadingZero(convertMs(selectedTime - Date.now()));
}

function addLeadingZero(value) {
  outputsRef.days.textContent = value.days.toString().padStart(2, '0');
  outputsRef.hours.textContent = value.hours.toString().padStart(2, '0');
  outputsRef.minutes.textContent = value.minutes.toString().padStart(2, '0');
  outputsRef.seconds.textContent = value.seconds.toString().padStart(2, '0');
}

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