/* Завдання:

Реалізуйте систему управління бібліотекою книг. Створіть конструктор Book, який має властивості title, author, і year. Потім створіть конструктор EBook, який наслідує Book і додає властивість fileSize та метод для завантаження книги. Додайте метод для виведення інформації про книгу (title і author) в прототип Book і переконайтесь, що EBook успадковує цей метод.

Вимоги:

[+] Використовуйте прототипи для наслідування.
[+] Додайте метод для виведення інформації про книгу до прототипу Book.
[+] Створіть метод для завантаження електронної книги в конструкторі EBook.
[+] Переконайтесь, що метод для виведення інформації про книгу працює для об'єктів EBook.
*/

function Book(title, author, year) {
  this.title = title;
  this.author = author;
  this.year = year;
}

Book.prototype.displayInfo = function () {
  return `Title: ${this.title}, author: ${this.author}, year: ${this.year}`;
};

function EBook(title, author, year, fileSize) {
  Book.call(this, title, author, year);
  this.fileSize = fileSize;
}

EBook.prototype = Object.create(Book.prototype);
EBook.prototype.constructor = EBook;
EBook.prototype.download = function () {
  return `Downloading ${this.title}, size: ${this.fileSize}`;
};

const book = new EBook('1984', 'George Orwell', '1949', '1310kb');
console.log(book.displayInfo());
console.log(book.download());
console.log(book.__proto__);

