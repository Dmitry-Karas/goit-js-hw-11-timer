import datepicker from 'js-datepicker'; // Либа календаря

const date = new Date();

// Настройки календаря
const picker = datepicker('.datepicker', {
  startDay: 1,
  position: 'bl',
  minDate: new Date(),
  customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  customMonths: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  overlayButton: 'Выбрать',
  overlayPlaceholder: `Год, ${date.getFullYear()}`,
});
