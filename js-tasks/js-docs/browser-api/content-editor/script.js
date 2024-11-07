/*
Завдання: Динамічний контент-редактор з використанням DOM API і localStorage/sessionStorage
Опис завдання: Створіть веб-додаток, який дозволяє користувачам створювати, редагувати та зберігати текстовий контент у браузері з можливістю відновлення після перезавантаження сторінки.

Технічні вимоги:

[+] Створення контенту: Використовуючи DOM API, дозвольте користувачам додавати нові текстові блоки на сторінку з використанням різних HTML тегів (наприклад, p, h1, h2).

[+] Редагування контенту: Імплементуйте інтерфейс для редагування тексту прямо на сторінці, включаючи стилізацію тексту (жирний, курсив тощо).

[+] Збереження та відновлення стану: Використовуйте localStorage або sessionStorage для збереження стану сторінки. Забезпечте можливість відновлення збереженого контенту після перезавантаження сторінки.
*/

const textContainer = document.getElementById('text-container');
const form = document.getElementById('form');
const boldBtn = document.getElementById('boldBtn');
const italicBtn = document.getElementById('italicBtn');
const underlineBtn = document.getElementById('underlineBtn');
const crossedBtn = document.getElementById('crossedBtn');
const colorInput = document.getElementById('colorInput');
const fontSizeInput = document.getElementById('fontSizeInput');
const addBtn = document.getElementById('addBtn');

let editMode = false;
let editIndex = null;
let currentStyles = {
  type: null,
  bold: false,
  italic: false,
  underline: false,
  crossed: false,
  color: '#fff',
  fontSize: '16px',
};

let texts = localStorage.getItem('texts')
  ? JSON.parse(localStorage.getItem('texts'))
  : [];

const load = () => {
  textContainer.innerHTML = '';

    if (texts.length === 0) {
      textContainer.classList.add('empty');
    } else {
      textContainer.classList.remove('empty');
    }

  texts.forEach((text, index) => {
    let element;
    if (text.styles.type === 'text') {
      element = document.createElement('p');
      element.classList.add('text');
    } else if (text.styles.type === 'subtitle') {
      element = document.createElement('h2');
      element.classList.add('subtitle');
    } else if (text.styles.type === 'title') {
      element = document.createElement('h1');
      element.classList.add('title');
    }

    if (element) {
      element.innerText = text.text;
      element.style.fontWeight = text.styles.bold ? 'bold' : 'normal';
      element.style.fontStyle = text.styles.italic ? 'italic' : 'normal';
      element.style.textDecoration = text.styles.underline
        ? 'underline'
        : text.styles.crossed
        ? 'line-through'
        : 'none';
      element.style.color = text.styles.color;
      element.style.fontSize = text.styles.fontSize;
      const elementContainer = document.createElement('div');
      elementContainer.classList.add('elementContainer');

      const editBtn = document.createElement('button');
      editBtn.classList.add('editBtn');
      editBtn.innerText = 'Edit';
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('deleteBtn');
      deleteBtn.innerText = 'Delete';
      elementContainer.append(element, editBtn, deleteBtn);
      editBtn.addEventListener('click', () => openFormForEdit(index));
      deleteBtn.addEventListener('click', () => deleteElement(index));

      textContainer.appendChild(elementContainer);
    }
  });
};

const updateLocalStorage = () => {
  localStorage.setItem('texts', JSON.stringify(texts));
};

const openForm = (type) => {
  currentStyles = { ...currentStyles, type };
  form.style.display = 'block';
  const textarea = document.getElementById('textarea');
  textarea.value = '';

  editMode = false;
  addBtn.textContent = 'Add';
};

const openFormForEdit = (index) => {
  editMode = true;
  editIndex = index;
  currentStyles = { ...texts[index].styles };

  form.style.display = 'block';
  const textarea = document.getElementById('textarea');
  textarea.value = texts[index].text;
  addBtn.textContent = 'Edit';

  textarea.style.fontWeight = currentStyles.bold ? 'bold' : 'normal';
  textarea.style.fontStyle = currentStyles.italic ? 'italic' : 'normal';
  textarea.style.textDecoration = currentStyles.underline
    ? 'underline'
    : currentStyles.crossed
    ? 'line-through'
    : 'none';
  textarea.style.color = currentStyles.color;
  textarea.style.fontSize = currentStyles.fontSize;
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const textareaValue = document.getElementById('textarea').value.trim();
  if (textareaValue) {
    if (editMode) {
      texts[editIndex].text = textareaValue;
      texts[editIndex].styles = { ...currentStyles };
      addBtn.textContent = 'Add';
      editMode = false;
    } else {
      texts.push({ text: textareaValue, styles: { ...currentStyles } });
    }
    load();
    updateLocalStorage();
    form.style.display = 'none';
  }
});

const deleteElement = (index) => {
  texts.splice(index, 1);
  updateLocalStorage();
  load();
};

const addTitle = document.getElementById('addTitle');
addTitle.addEventListener('click', () => openForm('title'));
const addSubtitle = document.getElementById('addSubtitle');
addSubtitle.addEventListener('click', () => openForm('subtitle'));
const addText = document.getElementById('addText');
addText.addEventListener('click', () => openForm('text'));

boldBtn.addEventListener('click', () => {
  currentStyles.bold = !currentStyles.bold;
  textarea.style.fontWeight = currentStyles.bold ? 'bold' : 'normal';
  boldBtn.classList.toggle('active', currentStyles.bold);
});

italicBtn.addEventListener('click', () => {
  currentStyles.italic = !currentStyles.italic;
  textarea.style.fontStyle = currentStyles.italic ? 'italic' : 'normal';
  italicBtn.classList.toggle('active', currentStyles.italic);
});

underlineBtn.addEventListener('click', () => {
  currentStyles.underline = !currentStyles.underline;
  textarea.style.textDecoration = currentStyles.underline
    ? 'underline'
    : currentStyles.crossed
    ? 'line-through'
    : 'none';
  underlineBtn.classList.toggle('active', currentStyles.underline);
});

crossedBtn.addEventListener('click', () => {
  currentStyles.crossed = !currentStyles.crossed;
  textarea.style.textDecoration = currentStyles.crossed
    ? 'line-through'
    : currentStyles.underline
    ? 'underline'
    : 'none';
  crossedBtn.classList.toggle('active', currentStyles.crossed);
});

colorInput.addEventListener('input', (e) => {
  currentStyles.color = e.target.value;
  textarea.style.color = currentStyles.color;
});

fontSizeInput.addEventListener('input', (e) => {
  currentStyles.fontSize = e.target.value + 'px';
  textarea.style.fontSize = currentStyles.fontSize;
});

load();
