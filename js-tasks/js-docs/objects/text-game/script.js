/*
Завдання: Створення Інтерактивної Гри на JavaScript

? Опис Завдання

Створи просту текстову гру на JavaScript, де гравці та об'єкти гри (наприклад, монстри, предмети) представлені як об'єкти. Кожен об'єкт має свої властивості та методи для взаємодії в грі.

? Структура Об'єктів

* Гравець (Player)
Властивості: ім'я, здоров'я, сила, ліки
Методи: атакувати, лікуватися

* Монстр (Monster)
Властивості: вид, здоров'я, сила
Методи: атакувати

*Предмет (Item)
Властивості: назва, тип (наприклад, зброя, ліки), ефект

? Логіка Гри
- Гравець може зустрічати різних монстрів та знаходити предмети.
- В бою гравець та монстр по черзі атакують один одного.
- Гравець може використовувати предмети для покращення своїх характеристик або лікування.
- Гра закінчується, коли здоров'я гравця досягає нуля.

Завдання 
[+] Створи Об'єкти: Визнач об'єкти для гравця, монстрів та предметів з відповідними властивостями та методами.
[+] Реалізуй Логіку Бою: Створи логіку для бою між гравцем та монстром, включаючи взаємні атаки та використання предметів.
[+] Інтерфейс Користувача: Реалізуй простий текстовий інтерфейс для взаємодії гравця з грою (наприклад, вибір дій, відображення статусу гравця та монстра).
[+] Логіка Гри: Створи основну логіку гри, яка включає створення гравця, зустрічі з Dмонстрами, знаходження предметів та умови завершення гри.

? Додатково
[+] Додай систему рівнів для гравця, де з кожним рівнем зростають його характеристики.
[+] Введи різноманітність монстрів з унікальними властивостями та атаками.
[+] Реалізуй систему інвентаря, де гравець може зберігати та використовувати знайдені предмети.

*/

import { characters } from './characters.js';

const container = document.getElementById('choose-character');

function showStartModal() {
  const modal = document.getElementById('startModal');
  modal.classList.remove('closed');

  const startGameBtn = document.getElementById('start-game-btn');
  startGameBtn.addEventListener('click', () => {
    modal.classList.add('closed');
    showStoryModal();
  });
}

const showStoryModal = () => {
  const modal = document.getElementById('storyModal');
  modal.classList.remove('storyModalClosed');

  const closeStoryModal = () => {
    modal.classList.add('storyModalClosed');
  };

  const closeModal = document.getElementById('closeModal');
  closeModal.addEventListener('click', closeStoryModal);
};

showStartModal();

characters.forEach((character) => {
  const card = document.createElement('div');
  card.classList.add('character-card');

  card.innerHTML = `
    <div class="character-info">
      <h2 class="character-race">${character.race}</h2>
      <div class="line-top"></div>
      <div class="image-container">
        <img src="${character.image}" alt="${character.race}" />
      </div>
      <div class="line-bottom"></div>
      <h3 class="character-name">${character.name}</h3>
      <p class="character-description">${character.description}</p>
    </div>
    <div class="characteristics-container">
      <ul class="character-characteristics">
      <h3>Character Characteristics</h3>
        ${character.characteristics
          .map(
            (char) => `
              <li class="characteristic">
                <div class="characteristic-number">${char.value}</div>
                <div class="characteristic-name">${char.name}</div>
              </li>
            `
          )
          .join('')}
      </ul>
      <ul class="attacks-container">
      <h3>Character Attacks</h3>
        ${character.attacks
          .map(
            (attack) => `
              <li class="attack-container">
                <div class="attack-name">${attack.name}</div>
                <div class="attack-description">${attack.description}</div>
              </li>
            `
          )
          .join('')}
      </ul>
    </div>
  `;

  // Додаємо обробник події кліку
  card.addEventListener('click', () => {
    // Зберігаємо обраного персонажа в localStorage
    localStorage.setItem('selectedCharacter', JSON.stringify(character));
    // Перехід на сторінку battlefield.html
    const basePath = window.location.pathname.split('/').slice(0, -1).join('/');
    window.location.href = `${basePath}/battlefield/battlefield.html`;
  });

  container.appendChild(card);
});

showStartModal();
