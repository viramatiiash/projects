import { items } from '../items.js';
import { levels } from '../levels.js';

let currentLevelIndex = 0;

// Функція для випадкового вибору предмета
function getRandomItem() {
  return items[Math.floor(Math.random() * items.length)];
}

// Відображення модального вікна з вибраним предметом
function showItemModal(item) {
  const modal = document.getElementById('item-modal');
  const itemName = document.getElementById('modal-item-name');
  const itemImage = document.getElementById('modal-item-image');
  const itemDescription = document.getElementById('modal-item-description');

  itemName.textContent = item.name;
  itemImage.src = `./../${item.image}`;
  itemDescription.textContent = item.description;

  modal.classList.remove('hidden');

  document.getElementById('close-modal-btn').addEventListener('click', () => {
    modal.classList.add('hidden');
    addEffectToHero(item); // Додаємо ефект до героя
  });
}

// Додавання ефекту до героя
function addEffectToHero(item) {
  const effectsContainer = document.querySelector('.additional-effects');
  const effectElement = document.createElement('div');
  effectElement.classList.add('effect-element');
  effectElement.innerHTML = `<img src="./../${item.image}">`;
  effectsContainer.appendChild(effectElement);
}

// Завантаження рівня
function loadLevel(levelIndex) {
  const levelData = levels[levelIndex];

  // Оновлюємо фон
  document.getElementById(
    'battlefield-container'
  ).style.backgroundImage = `url(./../${levelData.background})`;

  // Оновлюємо дані монстра
  const monsterContainer = document.querySelector('#monster-container');
  monsterContainer.innerHTML = `
  <h3 class="battle-name">${levelData.monster.name}</h3>
  <div class="img-container">
    <img src="./../${levelData.monster.image}" alt="${
    levelData.monster.name
  }"></div>
    <p>Health: ${levelData.monster.health}</p>
    <ul>
      ${levelData.monster.attacks
        .map(
          (attack) =>
            `<li><strong>${attack.name}:</strong> ${attack.damage} damage</li>`
        )
        .join('')}
    </ul>
  `;

  // Вибір випадкового предмета
  const randomItem = getRandomItem();
  showItemModal(randomItem);
}

// Наступний рівень
function nextLevel() {
  if (currentLevelIndex < levels.length - 1) {
    currentLevelIndex++;
    loadLevel(currentLevelIndex);
  } else {
    alert('Congratulations! You have completed all levels!');
  }
}

// Початкове завантаження
document.addEventListener('DOMContentLoaded', () => {
  loadLevel(currentLevelIndex);
});

// Отримання даних персонажа
const selectedCharacter = JSON.parse(localStorage.getItem('selectedCharacter'));

if (selectedCharacter) {
  const characterContainer = document.querySelector('#character-details');
  characterContainer.innerHTML = `
    <h3 class="battle-name">${selectedCharacter.name}</h3>
    <div class="img-container">
    <img src="./../${selectedCharacter.image}" alt="${
    selectedCharacter.name
  }"></div>
    <div class="character-skills">
      <ul class="character-chars">
        <h3>Characteristics</h3>
        ${selectedCharacter.characteristics
          .map(
            (stat) =>
              `<li class="stats"><span class="stat-name">${stat.name}:</span> <span class="stat-value">${stat.value}</span></li>`
          )
          .join('')}
      </ul>
      <div class="attacks-container">
        <ul class="character-attacks">
          <h3>Attacks</h3>
          ${selectedCharacter.attacks
            .map(
              (attack) =>
                `<button class="attack"><span>${attack.name}</span></button>`
            )
            .join('')}
        </ul>
        <div class="additional-effects">
          <h3>Additional Effects</h3>
        </div>
      </div>
    </div>
  `;
} else {
  window.location.href = 'index.html';
}

document.getElementById('next-level-btn').addEventListener('click', nextLevel);
