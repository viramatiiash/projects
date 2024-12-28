export class Entry {
  constructor(amount, category, currentDate, type) {
    this.amount = amount;
    this.category = category;
    this.currentDate = new Date(currentDate);
    this.type = type; // "income" або "expense"
  }

  // Метод для оновлення суми
  updateAmount(newAmount) {
    const amountToNumber = Number(newAmount);
    this.amount = amountToNumber;

  }

  // Метод для оновлення категорії
  updateCategory(newCategory) {
    this.category = newCategory;
  }
}

class BudgetManager {
  constructor() {
    this.entries = []; // Масив для зберігання записів
  }

  // Розрахунок загального балансу
  calculateBalance() {
    return this.entries.reduce((balance, entry) => {
      return entry.type === 'income'
        ? balance + entry.amount
        : balance - entry.amount;
    }, 0);
  }

  calculateBalanceByCategory(category) {
    return this.entries
      .filter((entry) => entry.category === category)
      .reduce((balance, entry) => {
        return entry.type === 'income'
          ? balance + entry.amount
          : balance - entry.amount;
      }, 0);
  }

  // Отримання записів за категорією
  getEntriesByCategory(category) {
    return this.entries.filter((entry) => entry.category === category);
  }
}

export const budgetManager = new BudgetManager();
