// ! 1. Створіть масив з трьох імен. Додайте нове ім'я до кінця масиву і виведіть його.
const names = ["Anna", "Misha", "Lesia"];
names.push("Vira");
console.log(names[names.length - 1]); // "Vira"


// ! 2. Видаліть перший елемент масиву і виведіть його.
const firstElement = names.shift();
console.log(firstElement); // "Anna"


// ! 3. Знайдіть індекс елемента зі значенням "John" в масиві ["Mike", "John", "Sara"].
const names2 = ['Mike', 'John', 'Sara'];
const index = names2.indexOf('John');
console.log(index); // 1

