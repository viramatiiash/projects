import { items } from '../items.js';
import { levels } from '../levels.js';

let currentLevelIndex = 0;
const dynamicEffects = []; // Для динамічних (одноразових) ефектів
const staticEffects = [];

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

  const closeModalBtn = document.getElementById('close-modal-btn');
  closeModalBtn.removeEventListener('click', closeModalHandler); // Знімаємо попередній слухач
  closeModalBtn.addEventListener('click', closeModalHandler, { once: true });

  function closeModalHandler() {
    modal.classList.add('hidden');
    addEffectToHero(item);
  }
}

function addEffectToHero(item) {
  if (item.dynamic) {
    dynamicEffects.push(item);
  } else {
    if (!staticEffects.some((effect) => effect.name === item.name)) {
      staticEffects.push(item);
    }
  }

  updateEffectsDisplay();
}

function updateEffectsDisplay() {
  const effectsContainer = document.querySelector('.additional-effects');
  const dynamicContainer = document.createElement('div');
  dynamicContainer.classList.add('dynamic-effects');
  const staticContainer = document.createElement('div');
  staticContainer.classList.add('static-effects');

  effectsContainer.innerHTML = '';
  dynamicContainer.innerHTML = '';
  staticContainer.innerHTML = '';

  dynamicEffects.forEach((effect) => {
    const effectElement = document.createElement('div');
    effectElement.classList.add('effect-element');
    effectElement.innerHTML = `
      <img src="./../${effect.image}" alt="${effect.name}">
    `;
    dynamicContainer.appendChild(effectElement);
  });

  staticEffects.forEach((effect) => {
    const effectElement = document.createElement('div');
    effectElement.classList.add('effect-element');
    effectElement.innerHTML = `
      <img src="./../${effect.image}" alt="${effect.name}">
    `;
    staticContainer.appendChild(effectElement);
  });

  effectsContainer.append(dynamicContainer, staticContainer);
}

function loadLevel(levelIndex) {
  const levelData = levels[levelIndex];

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
  <div class="character-skills">
    <h3>Characteristics (dynamic/static)</h3>
    <ul class="character-chars">
      ${levelData.monster.characteristics
        .map(
          (stat) =>
            `<li class="stats"><span class="stat-name">${stat.name}:</span> <span class="stat-value">${stat.value}</span></li>`
        )
        .join('')}
      </ul>
      <div class="attacks-container">
        <h3>Attacks</h3>
        <ul class="character-attacks">

          ${levelData.monster.attacks
            .map(
              (attack) =>
                `<button class="attack"><span>${attack.name}</span></button>`
            )
            .join('')}
        </ul>
  `;

  updateEffectsDisplay();

  const randomItem = getRandomItem();
  showItemModal(randomItem);
}

function nextLevel() {
  if (currentLevelIndex < levels.length - 1) {
    currentLevelIndex++;
    loadLevel(currentLevelIndex);
  } else {
    alert('Congratulations! You have completed all levels!');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadLevel(currentLevelIndex);
});

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
            <h3>Characteristics (dynamic/static)</h3>
      <ul class="character-chars">

        ${selectedCharacter.characteristics
          .map(
            (stat) =>
              `<li class="stats"><span class="stat-name">${stat.name}:</span> <span class="stat-value">${stat.value}</span></li>`
          )
          .join('')}
      </ul>
      <div class="attacks-container">
        <h3>Attacks</h3>
        <ul class="character-attacks">

          ${selectedCharacter.attacks
            .map(
              (attack) =>
                `<button class="attack"><span>${attack.name}</span></button>`
            )
            .join('')}
        </ul>
        <h3>Additional Effects (dynamic/static)</h3>
        <div class="additional-effects">
          
        </div>
      </div>
    </div>
  `;
} else {
  window.location.href = 'index.html';
}

document.getElementById('next-level-btn').addEventListener('click', nextLevel);
