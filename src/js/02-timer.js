import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const timeRef = document.querySelector('#datetime-picker');
const audioRef = document.querySelector('audio');
const buttonsRef = {
  start: document.querySelector('[data-start]'),
  reset: document.querySelector('[data-reset]'),
  stop: document.querySelector('[data-stop]'),
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
      audioRef.play();
      return Notify.failure('Please choose a date in the future');
    }

    buttonsRef.start.disabled = false;
    buttonsRef.start.addEventListener('click', evt => {
      audioRef.play();
      Notify.success('Your timer has started!');
      setCurrentTime(selectedDates[0]);

      intervalId = setInterval(() => {
        if (
          outputsRef.days.textContent === '00' &&
          outputsRef.hours.textContent === '00' &&
          outputsRef.minutes.textContent === '00' &&
          outputsRef.seconds.textContent === '06'
        ) {
          audioRef.play();
          Notify.success('Your timer has almost ended!', {
            timeout: 5000,
          });
          const endTimeoutId = setTimeout(() => {
            clearInterval(intervalId);
            setCurrentTime(Date.now());
            location.reload();
            clearTimeout(endTimeoutId);
          }, 5000);
        }

        setCurrentTime(selectedDates[0]);
      }, 1000);

      timeRef.disabled = true;
      buttonsRef.start.disabled = true;
      buttonsRef.stop.disabled = false;
    });

    buttonsRef.stop.addEventListener('click', evt => {
      audioRef.play();
      Notify.warning('You have stopped the timer!');
      clearInterval(intervalId);

      setCurrentTime(selectedDates[0]);

      buttonsRef.reset.disabled = false;
      buttonsRef.stop.disabled = true;
    });

    buttonsRef.reset.addEventListener('click', () => {
      location.reload();
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
