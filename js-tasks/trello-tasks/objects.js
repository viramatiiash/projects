// ! 1. Створіть об'єкт, який представляє книгу з властивостями title, author та year.
// ! 2. Додайте нову властивість genre до об'єкта книги.
// ! 3. Видаліть властивість year з об'єкта книги.

const book = {
  title: '1984',
  author: 'George Orwell',
  year: '1949',
}

book.genre = 'dystopian novel';
delete book.year;

console.log(book);
