/*
Завдання 3:

[+] Реалізуйте інтерфейс для відображення та управління контактами з телефонної книги з можливістю:
[+] Додавання нових контактів через форму.
[+] Редагування існуючих контактів.
[+] Видалення контактів.
[+]Пошуку контактів за ім'ям або номером телефону.

Вимоги:

[+] Використовуйте методи document.createElement, appendChild, addEventListener для створення елементів телефонної книги та управління ними.
[+] Забезпечте динамічне оновлення списку контактів при додаванні, редагуванні та видаленні.
[+] Зберігайте контакти в LocalStorage, щоб вони зберігались між перезавантаженнями сторінки.

Підказка:

Створіть структуру телефонної книги з використанням HTML-елементів ul та li. Додайте форми для додавання та редагування контактів, а також поле для пошуку.
*/

const list = document.getElementById('list');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const newContactModal = document.getElementById('newContactModal');
const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');
const newContactBtn = document.getElementById('newContactBtn');
const saveBtn = document.getElementById('saveBtn');
const closeBtn = document.getElementById('closeBtn');
const backDrop = document.getElementById('backDrop');

let contacts = localStorage.getItem('contacts')
  ? JSON.parse(localStorage.getItem('contacts'))
  : [];
let filteredContacts = [...contacts];

const load = (contacts) => {
  list.innerHTML = '';
  contacts.forEach((contact, index) => {
    const listItem = document.createElement('li');

    const contactContainer = document.createElement('div');
    contactContainer.classList.add('contactContainer');
    contactContainer.addEventListener(
      'click',
      () => (saveEditBtn.style.display = 'inline')
    );
    const buttonContainer = document.createElement('div');

    const number = document.createElement('span');
    number.innerText = index + 1 + '.';

    const nameSpan = document.createElement('span');
    nameSpan.innerText = contact.name;
    nameSpan.setAttribute('contenteditable', 'true');

    const phoneSpan = document.createElement('span');
    phoneSpan.innerText = contact.phone;
    phoneSpan.setAttribute('contenteditable', 'true');

    const saveEditBtn = document.createElement('button');
    saveEditBtn.innerText = 'Save';
    saveEditBtn.classList.add('saveEditBtn');
    saveEditBtn.addEventListener('click', () =>
      handleSaveEdit(index, nameSpan, phoneSpan)
    );

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.addEventListener('click', () => deleteContact(index));

    list.appendChild(listItem);
    listItem.append(contactContainer, buttonContainer);
    contactContainer.append(number, nameSpan, ':', phoneSpan);
    buttonContainer.append(saveEditBtn, deleteBtn);
  });
};

const handleSearch = () => {
  const searchContact = searchInput.value.toLowerCase();
  filteredContacts = contacts.filter((contact) => {
    return (
      contact.name.toLowerCase().includes(searchContact) ||
      contact.phone.toLowerCase().includes(searchContact)
    );
  });

  load(filteredContacts);
};

const localStorageUpdate = () => {
  localStorage.setItem('contacts', JSON.stringify(contacts));
};

const openModal = () => {
  newContactModal.style.display = 'block';
  backDrop.style.display = 'block';
};

const closeModal = () => {
  newContactModal.style.display = 'none';
  backDrop.style.display = 'none';
  nameInput.value = '';
  phoneInput.value = '';
};

const handleSaveEdit = (index, nameSpan, phoneSpan) => {
  const updatedName = nameSpan.innerText.trim();
  const updatedPhone = phoneSpan.innerText.trim();
  contacts[index] = { name: updatedName, phone: updatedPhone };
  localStorageUpdate();
  load(contacts);
};

const saveContact = () => {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  if (name && phone) {
    contacts.push({ name: name, phone: phone });
    localStorageUpdate();
    load(contacts);
  }
  closeModal();
};

const deleteContact = (index) => {
  contacts.splice(contacts.indexOf(filteredContacts[index]), 1);
  localStorageUpdate();
  load(contacts);
};

saveBtn.addEventListener('click', saveContact);
searchInput.addEventListener('input', handleSearch);
newContactBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
backDrop.addEventListener('click', closeModal);

load(contacts);
