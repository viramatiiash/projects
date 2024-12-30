export class Task {
  constructor(description, status, priority) {
    this.description = description;
    this.status = status;
    this.priority = priority;
  }

  updateStatus(newStatus) {
    this.status = newStatus;
  }

  updatePriority(newPriority) {
    this.priority = newPriority;
  }
}

export class TaskManager {
  constructor() {
    this.tasks = []; // Список завдань
  }

  // Додавання нового завдання
  addTask(description, status, priority) {
    const task = new Task(description, status, priority);
    this.tasks.push(task);
  }

  // Видалення завдання
  deleteTask(index) {
    this.tasks.splice(index, 1);
  }

  // Сортування завдань за пріоритетом
  sortTasksByPriority() {
    const priorityOrder = {
      high: 1,
      middle: 2,
      low: 3,
    };

    this.tasks.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }

  // Фільтрація завдань за статусом
  filterTasksByStatus(status) {
    return this.tasks.filter((task) => task.status === status);
  }

  // Фільтрація завдань за пріоритетом
  filterTasksByPriority(priority) {
    return this.tasks.filter((task) => task.priority === priority);
  }
}

export class TaskManagerWithStorage extends TaskManager {
  constructor() {
    super();
    this.loadTasksFromLocalStorage();
  }

  // Завантаження завдань з localStorage
  loadTasksFromLocalStorage() {
    const tasksData = localStorage.getItem('tasks');
    if (tasksData) {
      const tasksArray = JSON.parse(tasksData);
      this.tasks = tasksArray.map(
        (taskData) =>
          new Task(taskData.description, taskData.status, taskData.priority)
      );
    }
  }

  // Збереження завдань в localStorage
  saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  // Перевизначення додавання завдання для автоматичного збереження
  addTask(description, status, priority) {
    const newTask = {
      description,
      status,
      priority,
      timestamp: Date.now(), // Додаємо часову мітку
    };
    this.tasks.push(newTask); // Додаємо нове завдання до масиву
    this.saveTasksToLocalStorage(); // Зберігаємо зміни у LocalStorage
  }

  // Перевизначення видалення завдання для автоматичного збереження
  deleteTask(index) {
    super.deleteTask(index);
    this.saveTasksToLocalStorage();
  }
}
