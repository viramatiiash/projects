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
[+] Відобразіть актуальний стан у всіх вкладках браузера в реальному часі.

? Обробка помилок і обмежень:

[+] Забезпечте обробку помилок, наприклад, коли LocalStorage досягає ліміту квоти.
[+] Реалізуйте fallback для старіших браузерів, які можливо не підтримують LocalStorage або SessionStorage.

? Додаткові завдання для розширення проекту:

[+] Автоматичне видалення старих даних: Розробіть механізм для очищення застарілих або неактивних даних зі сховища.
[+] Захист даних: Впровадіть шифрування даних перед їх зберіганням у LocalStorage/SessionStorage для підвищення безпеки.
*/

const initialState = {
  theme: 'light',
  language: 'en',
};

const storageKey = 'appState';
const EXPIRATION_TIME = 24 * 60 * 60 * 1000;
const encryptionKey = 'my-secret-key';

const encryptData = (data, key) => {
  try {
    const jsonData = JSON.stringify(data);
    const cipherText = CryptoJS.AES.encrypt(jsonData, key).toString();
    return cipherText;
  } catch (error) {
    console.error('Помилка шифрування:', error);
    return null;
  }
};

const decryptData = (cipherText, key) => {
  if (!cipherText) {
    console.warn('Дані для розшифрування відсутні.');
    return null;
  }
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedText ? JSON.parse(decryptedText) : null;
  } catch (error) {
    console.error('Помилка дешифрування:', error);
    return null;
  }
};

const setCookie = (name, value, days = 1) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )};expires=${date.toUTCString()};path=/`;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(';').shift());
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const isLocalStorageAvailable = () => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    return false;
  }
};

const storageAvailable = isLocalStorageAvailable();

const saveState = (newState) => {
  const stateWithTimestamp = {
    ...newState,
    timestamp: Date.now(),
  };

  const encryptedState = encryptData(stateWithTimestamp, encryptionKey);

  try {
    if (storageAvailable) {
      localStorage.setItem(storageKey, encryptedState);
    } else {
      setCookie(storageKey, encryptedState);
    }
  } catch (e) {
    console.error('Помилка збереження стану:', e);
  }
};

const loadState = () => {
  let encryptedState;
  if (storageAvailable) {
    encryptedState = localStorage.getItem(storageKey);
  } else {
    encryptedState = getCookie(storageKey);
  }

  const state = encryptedState
    ? decryptData(encryptedState, encryptionKey)
    : null;

  if (!state) {
    console.warn('Стан відсутній, використовується початковий стан.');
    return initialState;
  }

  return state;
};

const clearState = () => {
  if (storageAvailable) {
    localStorage.removeItem(storageKey);
  } else {
    deleteCookie(storageKey);
  }
};

const checkExpiration = () => {
  const storedState = loadState();
  if (
    storedState.timestamp &&
    Date.now() - storedState.timestamp > EXPIRATION_TIME
  ) {
    clearState();
    console.log('Дані видалено через закінчення терміну дії.');
  }
};

const updateUI = (state) => {
  document.body.className = state.theme;
  document.getElementById('language-select').value = state.language;
};

const updateState = (newState) => {
  state = { ...state, ...newState };
  saveState(state);
  updateUI(state);
};

let state = loadState();
updateUI(state);

checkExpiration();

if (storageAvailable) {
  window.addEventListener('storage', (e) => {
    if (e.key === storageKey && e.newValue) {
      state = decryptData(e.newValue, encryptionKey);
      updateUI(state);
    }
  });
} else {
  setInterval(() => {
    const currentState = loadState();
    if (JSON.stringify(currentState) !== JSON.stringify(state)) {
      state = currentState;
      updateUI(state);
    }
  }, 2000);
}

document.getElementById('theme-toggle').addEventListener('click', () => {
  updateState({ theme: state.theme === 'light' ? 'dark' : 'light' });
});

document.getElementById('language-select').addEventListener('change', (e) => {
  updateState({ language: e.target.value });
  const langContainer = document.getElementById('langContainer');
  langContainer.innerHTML = '';
  const lang = document.createElement('p');
  lang.innerText = e.target.value;
  lang.classList.add('lang');
  langContainer.appendChild(lang);
});
