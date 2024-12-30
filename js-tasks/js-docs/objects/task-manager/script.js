/*
Завдання 3: Розробка Таск-Менеджера на JavaScript
Опис Завдання
Створи систему управління завданнями, де кожне завдання представлене як об'єкт з властивостями, такими як опис, статус, та пріоритет. Реалізуй функціонал для зміни статусу завдань, їх видалення, та сортування за пріоритетом.

Структура Об'єкта Task

Властивості:
Опис (description)
Статус (status) - наприклад, "нове", "в процесі", "завершено"
Пріоритет (priority) - наприклад, "високий", "середній", "низький"

Методи:
updateStatus(newStatus): Змінює статус завдання.
updatePriority(newPriority): Змінює пріоритет завдання.

Структура Системи Управління Завданнями

Масив або список об'єктів Task.
Функції для додавання нових завдань, видалення завдань, та сортування завдань за пріоритетом.

Завдання
[] Створи object Task: Визнач object з необхідними властивостями та методами.
[] Реалізуй Методи для Управління Завданнями: Створи методи для зміни статусу та пріоритету завдань.
[] Розроби Систему Управління Завданнями: Створи object  або список завдань та функції для їх додавання, видалення, та сортування.
[] Тестуй Систему: Перевір, як працює система з різними завданнями та сценаріями.
[] Додай можливість фільтрування завдань за статусом або пріоритетом.
[] Реалізуй збереження завдань у локальному сховищі браузера для збереження даних між сесіями.
[] Створи простий веб-інтерфейс для візуального представлення та управління завданнями.
*/

import { TaskManagerWithStorage } from './object.js';
const taskList = document.getElementById('taskList');

const handleChangeStatus = (index) => {
  const statusOrder = ['New', 'In Progress', 'Completed']; // Порядок статусів
  let currentStatusIndex = statusOrder.indexOf(taskManager.tasks[index].status);

  // Перевести в наступний статус або повернути на початок, якщо це останній
  currentStatusIndex = (currentStatusIndex + 1) % statusOrder.length;
  taskManager.tasks[index].status = statusOrder[currentStatusIndex]; // Оновлюємо статус

  taskManager.saveTasksToLocalStorage();
  renderTasks(); // Перерендерюємо після зміни
};

const handleChangePriority = (index) => {
  const priorityOrder = ['Low', 'Middle', 'High']; // Порядок пріоритетів
  let currentPriorityIndex = priorityOrder.indexOf(
    taskManager.tasks[index].priority
  );

  // Перевести в наступний пріоритет або повернути на початок, якщо це останній
  currentPriorityIndex = (currentPriorityIndex + 1) % priorityOrder.length;
  taskManager.tasks[index].priority = priorityOrder[currentPriorityIndex]; // Оновлюємо пріоритет

  taskManager.saveTasksToLocalStorage();
  renderTasks(); // Перерендерюємо після зміни
};

const renderTasks = () => {
  taskList.innerHTML = '';

  if (taskManager.tasks && taskManager.tasks.length > 0) {
    console.log(taskManager.tasks);

    taskManager.tasks.forEach((task, index) => {
      const taskElement = document.createElement('div');
      taskElement.classList.add('card');
      taskElement.innerHTML = `
        <div class="iconContainer"></div>
          <div class="text-container">
            <p class="description">${task.description}</p>
            <p class="status">Status: ${task.status}</p>
            <p class="priority">Priority: ${task.priority}</p>
          </div>
          <button class="deleteButton">Delete</button>
      `;

      const iconContainer = taskElement.querySelector('.iconContainer');

      let icon;
      let background;

      switch (task.priority.toLowerCase()) {
        case 'low':
          icon = `<img src="./assets/images/completed.png"/>`;
          background = `linear-gradient(rgba(108, 223, 66, 0.6), rgba(162, 255, 129, 0.6))`;
          break;
        case 'middle':
          icon = `<img src='./assets/images/wip.png' />`;
          background = `linear-gradient(rgba(255, 235, 9, 0.6), rgba(255, 242, 100, 0.6))`;
          break;
        default:
          icon = `<img src='./assets/images/new.png' />`;
          background = `linear-gradient(rgba(255, 96, 47, 0.6), rgba(255, 137, 100, 0.6))`;
      }

      switch (task.status.toLowerCase()) {
        case 'completed':
          icon = `<img src="./assets/images/completed.png"/>`;
          background = `linear-gradient(rgba(51, 51, 51, 0.539), rgba(169, 169, 169, 0.539))`;
          break;
        case 'in progress':
          icon = `<img src='./assets/images/wip.png' />`;
          break;
        default:
          icon = `<img src='./assets/images/new.png' />`;
      }

      iconContainer.innerHTML = icon;
      taskElement.style.background = background;

      const deleteButton = taskElement.querySelector('.deleteButton');
      deleteButton.addEventListener('click', () => {
        taskManager.deleteTask(index);
        renderTasks();
      });

      const changeStatus = taskElement.querySelector('.status');
      changeStatus.addEventListener('click', () => handleChangeStatus(index));

      // Додавання обробника для зміни пріоритету
      const changePriority = taskElement.querySelector('.priority');
      changePriority.addEventListener('click', () =>
        handleChangePriority(index)
      );

      taskList.appendChild(taskElement);
    });
  } else {
    console.log(`No Tasks found`);
  }
};

const taskManager = new TaskManagerWithStorage();
renderTasks();

document.getElementById('addTaskButton').addEventListener('click', () => {
  const description = document.getElementById('taskDescription').value;
  const status = document.getElementById('taskStatus').value;
  const priority = document.getElementById('taskPriority').value;

  console.log(description, status, priority);

  taskManager.addTask(description, status, priority);
  renderTasks();
});

document.getElementById('sortByStatus').addEventListener('click', () => {
  taskManager.tasks.sort((a, b) => b.status.localeCompare(a.status));
  renderTasks();
});

document.getElementById('sortByPriority').addEventListener('click', () => {
  const priorityOrder = {
    high: 1,
    middle: 2,
    low: 3,
  };

  taskManager.tasks.sort((a, b) => {
    // Якщо статус completed, переміщуємо в кінець
    if (
      a.status.toLowerCase() === 'completed' &&
      b.status.toLowerCase() !== 'completed'
    ) {
      return 1;
    }
    if (
      b.status.toLowerCase() === 'completed' &&
      a.status.toLowerCase() !== 'completed'
    ) {
      return -1;
    }
    // Сортування за пріоритетом
    return (
      priorityOrder[a.priority.toLowerCase()] -
      priorityOrder[b.priority.toLowerCase()]
    );
  });
  renderTasks();
});

document.getElementById('showAll').addEventListener('click', () => {
  // Сортуємо за timestamp, щоб повернути порядок додавання
  taskManager.tasks.sort((a, b) => a.timestamp - b.timestamp);
  renderTasks();
});
