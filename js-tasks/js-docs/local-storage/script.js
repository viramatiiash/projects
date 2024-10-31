/*
Завдання: Розробка мульти-табової синхронізації стану за допомогою LocalStorage/SessionStorage

Мета: Розробити систему, яка дозволяє синхронізувати стан користувача між кількома вкладками браузера в реальному часі, використовуючи LocalStorage та/або SessionStorage.

! Технічні вимоги:
? Ініціалізація стану:

[+] Створіть простий об'єкт стану, який може включати користувацькі налаштування, такі як тема інтерфейсу, мовні налаштування, або статус логіна.
[+] Ініціалізуйте цей стан у LocalStorage або SessionStorage при першому відкритті вкладки.

? Синхронізація стану між вкладками:

[+] Реалізуйте механізм, який слухає зміни у LocalStorage або SessionStorage (використовуючи події storage).
[+] При зміні даних у одній вкладці автоматично оновлюйте стан у всіх інших відкритих вкладках.

? Інтерфейс користувача:

[+] Розробіть простий інтерфейс користувача, де можна змінювати стан (наприклад, змінити тему або мову).
[] Відобразіть актуальний стан у всіх вкладках браузера в реальному часі.

? Обробка помилок і обмежень:

[] Забезпечте обробку помилок, наприклад, коли LocalStorage досягає ліміту квоти.
[] Реалізуйте fallback для старіших браузерів, які можливо не підтримують LocalStorage або SessionStorage.

? Додаткові завдання для розширення проекту:

[] Автоматичне видалення старих даних: Розробіть механізм для очищення застарілих або неактивних даних зі сховища.
[] Захист даних: Впровадіть шифрування даних перед їх зберіганням у LocalStorage/SessionStorage для підвищення безпеки.
*/

const initialState = {
  theme: 'light',
  language: 'en',
};

const loadState = () => JSON.parse(localStorage.getItem('appState')) || initialState;
let state = loadState();

const updateUI = (state) => {
  document.body.className = state.theme;
  document.getElementById('language-select').value = state.language;
};

const updateState = (newState) => {
  state = { ...state, ...newState };
  localStorage.setItem('appState', JSON.stringify(state));
  updateUI(state);
};

window.addEventListener('storage', (e) => {
  if (e.key === 'appState') {
    state = JSON.parse(e.newValue);
    updateUI(state);
  }
});

document.getElementById('theme-toggle').addEventListener('click', () => {
  updateState({ theme: state.theme === 'light' ? 'dark' : 'light' });
});

document.getElementById('language-select').addEventListener('click', (e) => {
  updateState({ language: e.target.value });
});

updateUI(state);
console.log(state);