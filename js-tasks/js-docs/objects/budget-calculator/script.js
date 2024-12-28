/*
Завдання 4: Створення Калькулятора Бюджету на JavaScript
Опис Завдання
Створи програму для управління особистими фінансами, де користувач може вводити доходи та витрати. Кожен фінансовий запис представлений як об'єкт з властивостями, такими як сума, категорія та дата.

Структура Об'єкта Entry
Властивості: сума (amount), категорія (category), дата (date), тип (type: дохід або витрата)
Методи: updateAmount(newAmount), updateCategory(newCategory)

Логіка Роботи
Введення Даних: Користувач може вводити нові записи про доходи та витрати.
Відображення Балансу: Розрахунок загального балансу на основі введених даних.

Завдання
[] Створи Об'єкт Entry: Визнач об'єкт з необхідними властивостями та методами.
[] Реалізуй Логіку Введення та Розрахунку Балансу: Створи систему для додавання та відслідковування доходів/витрат.
[] Тестування та Валідація: Перевір роботу програми з різними сценаріями та коректність розрахунків.

Додатково
[] Графічний Інтерфейс: Реалізуй простий веб-інтерфейс для введення та перегляду фінансових записів.
[] Звіти: Генерація звітів за місяць або категорією.
*/

import { budgetManager, Entry } from './object.js';

const addBtn = document.getElementById('addBtn');
const closeBtn = document.getElementById('closeBtn');
const newBtn = document.getElementById('newBtn');
const filterBtn = document.getElementById('filterBtn');
const allBtn = document.getElementById('allBtn');

const cards = document.getElementById('cards');
const categories = document.getElementById('categories');
const form = document.getElementById('form');
const incomeBtn = document.getElementById('income');
incomeBtn.checked = true;

let entryNumber = 1;
let isHovered = false;

let entries = localStorage.getItem('entries')
  ? JSON.parse(localStorage.getItem('entries')).map((entry) => ({
      ...entry,
      currentDate: new Date(entry.currentDate), // Перетворення рядка у Date
    }))
  : [];

budgetManager.entries = entries;

const renderCards = (filteredEntries = entries) => {
  cards.innerHTML = ''; // Очищення контейнера перед рендерингом
  categories.innerHTML = '';

const uniqueCategories = [...new Set(entries.map((entry) => entry.category))];
  
      uniqueCategories.forEach((categoryName) => {
        const line = document.createElement('div');
        line.classList.add('line');

        const arrow = `
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg>
`;

        const category = document.createElement('p');
        category.classList.add('category-item');
        category.innerHTML = `
      ${categoryName} <div class="arrowContainer">${arrow}</div>`;
        category.addEventListener('click', () => {
          filterByCategory(categoryName);
        });
        categories.append(category, line);
      });

  filteredEntries.forEach((entry, index) => {
    const dateObj = new Date(entry.currentDate); // Перетворення рядка у об'єкт Date
    const date = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;



    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h2 class="card-title">№ ${index + 1}
        <div class="dateContainer">
          <span class="date">${date}</span>
        </div>
      </h2>
      <div class="infos">
        <p class="text">Amount: <span class="insertedInfo">${
          entry.amount
        }$</span></p>
        <p class="text">Category: <span class="insertedInfo">${
          entry.category
        }</span></p>
        <p class="text">Type: <span class="insertedInfo">${
          entry.type
        }</span></p>
      </div>
      <button class="deleteBtn" data-index="${index}">Delete</button>`;
    cards.appendChild(card);
  });

  const categoryName = document.getElementById('categoryName');
  categoryName.textContent = 'everything together';
  const balance = document.getElementById('balance');
  balance.textContent = budgetManager.calculateBalance();

  // Додавання обробників подій для кнопок видалення
  const deleteButtons = document.querySelectorAll('.deleteBtn');
  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      deleteElement(index);
    });
  });
};

const handleSubmit = (e) => {
  e.preventDefault();
  const amount = Number(document.getElementById('amount').value.trim());
  const category = document.getElementById('category').value.trim();
  const type = document.querySelector('input[name="type"]:checked')?.value;

  const currentDate = new Date();

  entries.push({ amount, category, type, currentDate });
  updateLocalStorage();
  renderCards();
  form.reset();

  document.getElementById('income').checked = true;
};

const updateLocalStorage = () => {
  localStorage.setItem('entries', JSON.stringify(entries));
};

const deleteElement = (index) => {
  entries.splice(index, 1);
  updateLocalStorage();
  renderCards();
};

const calculateEntryNumber = () => {
  entryNumber += 1;
};

// Функція фільтрації за категорією
const filterByCategory = (category) => {
  const filteredEntries = entries.filter(
    (entry) => entry.category === category
  );

  const categoryName = document.getElementById('categoryName');
  const categoryBalance = budgetManager.calculateBalanceByCategory(category);

  renderCards(filteredEntries);
  const balance = document.getElementById('balance');
  balance.textContent = categoryBalance;

  categoryName.textContent = filteredEntries[0].category;
};

// Функція скидання фільтру
const resetFilter = () => {
  const categoryName = document.getElementById('categoryName');
  categoryName.textContent = 'everything together';
  const balance = document.getElementById('balance');
  balance.textContent = budgetManager.calculateBalance();
  console.log(balance.textContent);

  renderCards(entries);
};

const handleFormToggle = () => {
  form.classList.toggle('active');
};

newBtn.addEventListener('click', () => {
  handleFormToggle();
  newBtn.style.display = 'none';
});

addBtn.addEventListener('click', (e) => {
  handleSubmit(e, entryNumber);
  calculateEntryNumber();
});

closeBtn.addEventListener('click', () => {
  handleFormToggle();
  newBtn.style.display = 'block';
});

const deleteButtons = document.querySelectorAll('.deleteBtn');
deleteButtons.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    deleteElement(index);
    btn.parentElement.remove();
    updateLocalStorage();
  });
});

const handleMouseMove = (event) => {
  const rect = categories.getBoundingClientRect();
  const isInside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  if (isInside) {
    isHovered = true;
    categories.classList.add('open'); // Категорії залишаються відкритими
  } else {
    isHovered = false;
    setTimeout(() => {
      if (!isHovered) {
        categories.classList.remove('open'); // Закрити категорії
      }
    }, 300);
  }
};

filterBtn.addEventListener('mouseenter', () => {
  isHovered = true;
  categories.classList.add('open');
});

filterBtn.addEventListener('mouseleave', () => {
  isHovered = false;
  setTimeout(() => {
    if (!isHovered) {
      categories.classList.remove('open');
    }
  }, 300);
});

categories.addEventListener('mousemove', handleMouseMove);
categories.addEventListener('mouseleave', () => {
  isHovered = false;
  setTimeout(() => {
    if (!isHovered) {
      categories.classList.remove('open');
    }
  }, 300);
});

allBtn.addEventListener('click', resetFilter);

document.addEventListener('DOMContentLoaded', () => {
  renderCards();
});
