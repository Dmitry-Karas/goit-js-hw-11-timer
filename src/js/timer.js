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
  constructor({ selector, targetDate, onTick, enableInterface, disableInterface }) {
    this.selector = selector;
    this.targetDate = targetDate;
    this.intervalId = null;
    this.isActive = false;
    this.onTick = onTick;
    this.enableInterface = enableInterface;
    this.disableInterface = disableInterface;
    this.checkDate(); // Проверка сохраненной даты и запуск таймера при ее наличии
  }

  checkDate() {
    const date = localStorage.getItem('date');

    if (date) {
      this.start();
      refs.datepicker.value = date.slice(0, 15);
    }
  }

  start() {
    this.isActive = true;
    this.disableInterface(); // Деактивация кнопки старт и инпута
    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const startTime = this.targetDate;
      const deltaTime = startTime - currentTime;
      const timeComponents = this.getTimeComponents(deltaTime);

      this.onTick(timeComponents);
    }, 1000);
  }

  stop() {
    this.isActive = false;
    clearInterval(this.intervalId); // Очистка интервала
    localStorage.clear(); // Очистка хранилища
    refs.datepicker.placeholder = 'Выбери дату!'; // Сброс плейсхолдера
    this.onTick({}); // Сброс интерфейса
    this.enableInterface(); // Включение кнопки и инпута
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
  disableInterface: disableInterface,
  enableInterface: enableInterface,
});

function updateInterface({ days = '--', hours = '--', mins = '--', secs = '--' }) {
  refs.days.textContent = `${days}`;
  refs.hours.textContent = `${hours}`;
  refs.mins.textContent = `${mins}`;
  refs.secs.textContent = `${secs}`;
}

// Деактивация инпута и кнопки старт
function disableInterface() {
  refs.datepicker.setAttribute('disabled', 'disabled');
  refs.startBtn.setAttribute('disabled', 'disabled');
}

// Активация инпута и кнопки старт
function enableInterface() {
  refs.datepicker.removeAttribute('disabled');
  refs.startBtn.removeAttribute('disabled');
}

function onSelectDate() {
  timer.targetDate = new Date(refs.datepicker.value); // Установка даты

  // Проверка на актуальность выбранной даты
  if (Date.now() > timer.targetDate) {
    timer.stop();

    // Модалка с ошибкой при выборе не актуальной даты
    swal({
      text: 'Эту дату мы уже дождались, пирожок! \nПодождем другую? ;)',
      icon: 'error',
    });
  } else if (refs.datepicker.value) {
    timer.start();

    localStorage.setItem('date', timer.targetDate); // Сохранение даты

    // Модалка при успешном выборе даты
    swal({
      className: 'swal-bg--start',
      button: false,
      timer: 2000,
    });
  }
}

refs.stopBtn.addEventListener('click', () => {
  if (!timer.isActive) {
    return;
  }

  swal({ className: 'swal-bg--stop', button: false, timer: 2000 });
  timer.stop();
});

refs.startBtn.addEventListener('click', onSelectDate);
