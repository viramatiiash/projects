/*
Завдання 1:

Реалізуйте інтерфейс календаря з можливістю:

[+] Вибору дати.
[+] Перегляду подій на вибрану дату.
[+] Додавання нових подій до вибраної дати.
[] Видалення подій з вибраної дати.

Вимоги:

[+] Використовуйте методи document.createElement, appendChild, addEventListener для створення елементів календаря та подій.
[+] Забезпечте динамічне оновлення списку подій при виборі дати.
[+] Зберігайте події в LocalStorage, щоб вони зберігались між перезавантаженнями сторінки.

Підказка:

Створіть структуру календаря з таблицею або списком, де кожна дата є окремим елементом. При натисканні на дату відображайте список подій для цієї дати та форму для додавання нових подій.
*/

// ! States
let nav = 0;
let clicked = null;
let events = localStorage.getItem('events')
  ? JSON.parse(localStorage.getItem('events'))
  : [];

// ! Constants
const calender = document.getElementById('calender');
const newEventModal = document.getElementById('newEventModal');
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

// ! Backdrop Event
backDrop.addEventListener('click', (e) => {
  e.stopPropagation();
  closeModal();
});

// ! Open Modal Function
const openModal = (date) => {
  clicked = date;
  events = JSON.parse(localStorage.getItem('events')) || [];
  const eventForDay = events.find((e) => e.date === clicked);

  const eventTextContainer = document.getElementById('eventTextContainer');
  eventTextContainer.innerHTML = '';

  if (eventForDay && eventForDay.titles.length > 0) {
    eventTextContainer.style.display = 'block';
    eventForDay.titles.forEach((title, index) => {
      const eventText = document.createElement('li');
      eventText.innerText = title;
      eventTextContainer.appendChild(eventText);

      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete';
      deleteButton.classList.add('deleteButton');
      deleteButton.addEventListener('click', () => deleteSingleEvent(index));
      eventText.appendChild(deleteButton);
    });
  } else {
    eventTextContainer.style.display = 'none';
  }

  newEventModal.style.display = 'block';
  backDrop.style.display = 'block';
};

// ! When the document loads - only one time
const load = () => {
  const dt = new Date();
  events = JSON.parse(localStorage.getItem('events')) || [];

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

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
        eventDiv.innerText = `${eventForDay.titles.length} events`;
        daySquare.appendChild(eventDiv);

        const eventText = document.createElement('p');
        document.getElementById('eventTextContainer').appendChild(eventText);

        eventText.innerText = eventForDay.title;
        eventTextContainer.innerText = '';
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
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
};

const saveEvent = () => {
  const eventTitle = eventTitleInput.value.trim();
  if (eventTitle) {
    eventTitleInput.classList.remove('error');

    const eventForDay = events.find((e) => e.date === clicked);

    if (eventForDay) {
      eventForDay.titles.push(eventTitle);
    } else {
      events.push({
        date: clicked,
        titles: [eventTitle],
      });
    }

    localStorage.setItem('events', JSON.stringify(events));
    openModal(clicked);
    eventTitleInput.value = '';
  } else {
    eventTitleInput.classList.add('error');
  }
};

const deleteSingleEvent = (eventIndex) => {
  const eventForDay = events.find((e) => e.date === clicked);

  if (eventForDay) {
    eventForDay.titles.splice(eventIndex, 1);

    if (eventForDay.titles.length === 0) {
      events = events.filter((e) => e.date !== clicked);
    }

    localStorage.setItem('events', JSON.stringify(events));
    openModal(clicked);
  }
};

// ! Delete All Events
const deleteAllEvents = () => {
  events = [];
  localStorage.setItem('events', JSON.stringify(events));
  load();
  openModal(clicked);
};

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
  document.getElementById('closeButton').addEventListener('click', closeModal);

  document
    .getElementById('deleteAllButton')
    .addEventListener('click', deleteAllEvents);
};

initButtons();
load();
