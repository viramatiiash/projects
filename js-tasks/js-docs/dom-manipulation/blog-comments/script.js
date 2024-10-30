/*
Завдання 4:

[+] Створіть динамічну систему коментарів для блогу з можливістю:
[+] Додавання нових коментарів через форму.
[+] Відповіді на коментарі (вкладені коментарі).
[+] Видалення коментарів.
[+] Відображення часу додавання коментаря.

Вимоги:

[+] Використовуйте методи document.createElement, appendChild, addEventListener для створення елементів системи коментарів та управління ними.
[+] Забезпечте динамічне оновлення списку коментарів при додаванні, відповіді та видаленні.
[+] Зберігайте коментарі в LocalStorage, щоб вони зберігались між перезавантаженнями сторінки.

Підказка:

Створіть структуру системи коментарів з використанням HTML-елементів ul та li. Додайте форми для додавання та відповіді на коментарі, а також кнопку для видалення коментарів.
*/

let comments = localStorage.getItem('comments')
  ? JSON.parse(localStorage.getItem('comments'))
  : [];

const listContainer = document.getElementById('listContainer');
const list = document.getElementById('list');
const addBtn = document.getElementById('addBtn');
const form = document.getElementById('form');
const backDrop = document.getElementById('backDrop');
const modal = document.getElementById('modal');
const replyForm = document.getElementById('replyForm');
const replyInput = document.getElementById('replyInput');
const submitButton = document.getElementById('submitButton');

const updateLocalStorage = () => {
  localStorage.setItem('comments', JSON.stringify(comments));
};

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const day = currentDate.getDate();
const hours = currentDate.getHours();
const minutes = currentDate.getMinutes();

const load = () => {
  list.innerHTML = '';
  renderComments(comments, list);
};

const renderComments = (commentsArray, container, isNested = false) => {
  commentsArray.forEach((comment, index) => {
    const listItem = document.createElement('li');

    const dateContainer = document.createElement('div');
    listItem.appendChild(dateContainer);

    const number = index + 1;

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('dateSpan');
    dateSpan.innerText = comment.date;

    const textSpan = document.createElement('span');
    textSpan.classList.add('textSpan');
    textSpan.innerText = comment.text;
    dateContainer.append(number, '.', ' ', dateSpan, ' : ', textSpan);

    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('actionsContainer');
    listItem.appendChild(actionsContainer);

    if (!isNested) {
      const replyButton = document.createElement('button');
      replyButton.innerText = 'Reply';
      replyButton.classList.add('replyButton');
      replyButton.addEventListener('click', () => showReplyForm(comment));
      actionsContainer.appendChild(replyButton);
    }

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('deleteButton');
    deleteButton.addEventListener('click', () =>
      deleteComment(commentsArray, index)
    );

    actionsContainer.appendChild(deleteButton);

    container.appendChild(listItem);
    const repliesContainer = document.createElement('ul');

    const commentsButton = document.createElement('button');
    commentsButton.innerText = 'Comments';
    commentsButton.classList.add('commentsButton');
    commentsButton.addEventListener('click', () => {
      repliesContainer.classList.toggle('active');
    });

    if (comment.replies && comment.replies.length > 0) {
      container.appendChild(repliesContainer);

      actionsContainer.appendChild(commentsButton);
      renderComments(comment.replies, repliesContainer, true);
    }
  });
};

const deleteComment = (commentsArray, index) => {
  commentsArray.splice(index, 1);
  updateLocalStorage();
  load();
};

const showReplyForm = (comment) => {
  modal.style.display = 'block';
  backDrop.style.display = 'block';

  replyForm.comment = comment;
};

replyForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const replyText = replyInput.value.trim();
  if (replyText) {
    replyForm.comment.replies.push({
      text: replyText,
      date: `${day}/${month}/${year} ${hours}:${minutes}`,
      replies: [],
    });

    replyInput.value = '';
    modal.style.display = 'none';
    backDrop.style.display = 'none';

    updateLocalStorage();
    load();
  }
});

backDrop.addEventListener('click', () => {
  modal.style.display = 'none';
  backDrop.style.display = 'none';
});

form.addEventListener('submit', (e) => {
  e.preventDefault(); 

  const commentText = form.elements['comment'].value.trim(); 
  if (commentText) {
    comments.push({
      text: commentText,
      date: `${day}/${month}/${year} ${hours}:${minutes}`,
      replies: [],
    });

    form.reset();

    updateLocalStorage();
    load();
  }
});

load();