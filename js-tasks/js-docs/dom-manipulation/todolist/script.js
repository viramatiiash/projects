/*
Завдання 2:

[+] Створіть динамічний список завдань для проекту з можливістю:
[+] Додавання завдань до проекту через форму.
[+] Відзначення завдань як виконаних.
[+] Видалення завдань.
[+] Фільтрація завдань за статусом (всі, виконані, невиконані).

Вимоги:

[+] Використовуйте методи document.createElement, appendChild, addEventListener для створення елементів списку завдань та управління ними.
[+] Забезпечте динамічне оновлення списку завдань при додаванні, відзначенні як виконаних та видаленні.
[+] Зберігайте стан завдань в LocalStorage, щоб вони зберігались між перезавантаженнями сторінки.

Підказка:

Створіть структуру списку завдань з використанням HTML-елементів ul та li. Додайте кнопки для видалення та відзначення завдань, а також форми для додавання нових завдань.
*/

let tasks = localStorage.getItem('tasks')
  ? JSON.parse(localStorage.getItem('tasks'))
  : [];

const listContainer = document.getElementById('listContainer');
const list = document.getElementById('list');
const addBtn = document.getElementById('addBtn');
const form = document.getElementById('form');
const tick = `
<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px"><path d="M 19.980469 5.9902344 A 1.0001 1.0001 0 0 0 19.292969 6.2929688 L 9 16.585938 L 5.7070312 13.292969 A 1.0001 1.0001 0 1 0 4.2929688 14.707031 L 8.2929688 18.707031 A 1.0001 1.0001 0 0 0 9.7070312 18.707031 L 20.707031 7.7070312 A 1.0001 1.0001 0 0 0 19.980469 5.9902344 z"/></svg>
`;

let filter = 'all';

const load = () => {
  list.innerHTML = '';

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'notCompleted') return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const listItem = document.createElement('li');
    const textSpan = document.createElement('span');
    textSpan.innerText = task.text;
    textSpan.style.textDecoration = task.completed ? 'line-through' : '';
    textSpan.style.color = task.completed ? '#6bde45' : '';
    listItem.appendChild(textSpan);
    list.appendChild(listItem);

    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('actionsContainer');

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.classList.add('deleteBtn');
    // deleteBtn.style.textDecoration = 'none';
    deleteBtn.addEventListener('click', () => deleteTask(index));
    actionsContainer.appendChild(deleteBtn);

    const gap = document.createElement('div');
    gap.classList.add('gap');
    actionsContainer.appendChild(gap);
    gap.innerHTML = task.completed ? tick : '';
    gap.addEventListener('click', () => toggleComplete(index));
    listItem.appendChild(actionsContainer);
  });
};

const deleteTask = (index) => {
  tasks.splice(index, 1);
  updateLocalStorage();
  load();
};

const toggleComplete = (index) => {
  tasks[index].completed = !tasks[index].completed;
  updateLocalStorage();
  load();
};

const updateLocalStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('input');
  const inputValue = input.value.trim();
  if (inputValue) {
    tasks.push({ text: inputValue, completed: false });
    updateLocalStorage();
    load();
    input.value = '';
  }
});

const createFilterButtons = () => {
  const buttons = document.createElement('div');
  buttons.classList.add('buttons');

  const allBtn = document.createElement('button');
  allBtn.classList.add('allBtn');
  allBtn.innerText = 'All';
  buttons.appendChild(allBtn);
  allBtn.addEventListener('click', () => {
    filter = 'all';
    load();
  });

  const completedBtn = document.createElement('button');
  completedBtn.classList.add('completedBtn');
  completedBtn.innerText = 'Completed';
  buttons.appendChild(completedBtn);
  completedBtn.addEventListener('click', () => {
    filter = 'completed';
    load();
  });

  const notCompletedBtn = document.createElement('button');
  notCompletedBtn.classList.add('notCompletedBtn');
  notCompletedBtn.innerText = 'Not completed';
  buttons.appendChild(notCompletedBtn);
  notCompletedBtn.addEventListener('click', () => {
    filter = 'notCompleted';
    load();
  });

  listContainer.appendChild(buttons);
};

createFilterButtons();
load();
