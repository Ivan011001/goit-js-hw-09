import { Notify } from 'notiflix/build/notiflix-notify-aio';

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

const formRef = document.querySelector('.form');
formRef.addEventListener('submit', evt => {
  evt.preventDefault();

  const {
    elements: { delay, step, amount },
  } = formRef;

  let mainDelay = Number(delay.value);
  const mainStep = Number(step.value);
  const mainAmount = Number(amount.value);

  if (mainDelay < 0 || mainStep < 0 || mainAmount <= 0) {
    return Notify.info('Unfortunately, your input is invalid');
  }

  for (let i = 1; i <= mainAmount; i += 1) {
    createPromise(i, mainDelay)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });

    mainDelay += mainStep;
  }

  formRef.reset();
});
