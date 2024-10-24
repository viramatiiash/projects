/*
Завдання 1:

Реалізуйте інтерфейс календаря з можливістю:

[] Вибору дати.
[] Перегляду подій на вибрану дату.
[] Додавання нових подій до вибраної дати.
[] Видалення подій з вибраної дати.

Вимоги:

[] Використовуйте методи document.createElement, appendChild, addEventListener для створення елементів календаря та подій.
[] Забезпечте динамічне оновлення списку подій при виборі дати.
[] Зберігайте події в LocalStorage, щоб вони зберігались між перезавантаженнями сторінки.

Підказка:

Створіть структуру календаря з таблицею або списком, де кожна дата є окремим елементом. При натисканні на дату відображайте список подій для цієї дати та форму для додавання нових подій.
*/

// ! States
let nav = 0; // month 0 - current
let clicked = null; // clicked month
let events = localStorage.getItem('events')
  ? JSON.parse(localStorage.getItem('events'))
  : []; // array of event objects pulled from local storage. JSON.parse(localStorage.getItem('events')) - array of event objects

// ! Constants
const calender = document.getElementById('calender');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const eventContainer = document.getElementById('eventContainer');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// ! Open Modal Function
const openModal = (date) => {
  clicked = date;
  const eventForDay = events.find((e) => e.date === clicked);

  if (eventForDay) {
    // const eventText = document.createElement('p');
    //  document.getElementById('eventTextContainer').appendChild(eventText);
    // eventText.innerText = eventForDay.title;
    // deleteEventModal.style.display = 'block';
    newEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }

  backDrop.style.display = 'block';
};

// ! When the document loads - only one time
const load = () => {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  // console.log(day, month, year);

  const firstDayOfMonth = new Date(year, month, 1); // we get the previous month with the first day of the next month. It returns number.
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // 0 - the last day in the previous month
  // console.log(daysInMonth); // october - 31

  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  // console.log(dateString);

  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
  // console.log(paddingDays);

  document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString(
    'en-us',
    { month: 'long' }
  )} ${year}`;

  calender.innerHTML = '';

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('li');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find((e) => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        eventContainer.innerText = '';
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('padding');
    }
    calender.appendChild(daySquare);
  }
};

const closeModal = () => {
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  load();
};

const saveEvent = (date) => {
    clicked = date;

  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });
    const eventForDay = events.find((e) => e.date === clicked);
    localStorage.setItem('events', JSON.stringify(events));
    const eventText = document.createElement('p');
    document.getElementById('eventTextContainer').appendChild(eventText);
    eventText.innerText = eventForDay.title;

    // closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
};

// ! Delete Button Event
const deleteEvent = () => {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events)); // reset
  closeModal();
}

// ! Buttons functionality
const initButtons = () => {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener('click', closeModal);

  document
    .getElementById('deleteButton')
    .addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);
};

initButtons();
load();
