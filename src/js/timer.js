import swal from 'sweetalert'; // Либа модалки

const refs = {
  datepicker: document.querySelector('.datepicker'),
  stopBtn: document.querySelector('[data-action="stop"]'),
  startBtn: document.querySelector('[data-action="start"]'),
  days: document.querySelector('[data-value="days"]'),
  hours: document.querySelector('[data-value="hours"]'),
  mins: document.querySelector('[data-value="mins"]'),
  secs: document.querySelector('[data-value="secs"]'),
};

class CountdownTimer {
  constructor({ selector, targetDate, onTick }) {
    this.selector = selector;
    this.targetDate = targetDate;
    this.onTick = onTick;
    this.intervalId = null;
    this.checkDate(); // Проверка сохраненной даты и запуск таймера при ее наличии
  }

  checkDate() {
    const date = localStorage.getItem('date');

    if (date) {
      this.start();
      refs.datepicker.placeholder = date.slice(0, 15);
    }
  }

  start() {
    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const startTime = this.targetDate;
      const deltaTime = startTime - currentTime;
      const timeComponents = this.getTimeComponents(deltaTime);

      this.onTick(timeComponents);
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalId); // Очистка интервала
    localStorage.clear(); // Очистка хранилища
    this.onTick({}); // Сброс интерфейса
    refs.datepicker.placeholder = 'Выбери дату!'; // Сброс плейсхолдера
  }

  getTimeComponents(time) {
    const days = this.pad(Math.floor(time / (1000 * 60 * 60 * 24)));
    const hours = this.pad(Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const mins = this.pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = this.pad(Math.floor((time % (1000 * 60)) / 1000));

    return { days, hours, mins, secs };
  }

  pad(value) {
    return String(value).padStart(2, '0');
  }
}

const timer = new CountdownTimer({
  selector: '#timer-1',
  targetDate: new Date(localStorage.getItem('date')),
  onTick: updateInterface,
});

function updateInterface({ days = '--', hours = '--', mins = '--', secs = '--' }) {
  refs.days.textContent = `${days}`;
  refs.hours.textContent = `${hours}`;
  refs.mins.textContent = `${mins}`;
  refs.secs.textContent = `${secs}`;
}

function onSelectDate() {
  timer.targetDate = new Date(refs.datepicker.value); // Установка даты

  // Проверка на актуальность выбранной даты
  if (Date.now() > timer.targetDate) {
    timer.stop();

    // Модалка с ошибкой при выборе текущей даты
    swal({
      text: 'Эту дату мы уже дождались, пирожок! \nПодождем другую? ;)',
      icon: 'error',
    });
  } else if (refs.datepicker.value) {
    timer.start(); // Запуск таймера
    localStorage.setItem('date', timer.targetDate); // Сохранение даты

    // Модалка при успешном выборе даты
    swal({
      className: 'swal-bg',
      button: false,
      timer: 2000,
    });
  }
}

refs.stopBtn.addEventListener('click', timer.stop.bind(timer));
refs.startBtn.addEventListener('click', onSelectDate);
