import { items } from '../items.js';
import { levels } from '../levels.js';
import { Character, characters } from './../characters.js';

console.log(characters);

let turn = Math.random() > 0.5 ? 'hero' : 'monster'; // Рандомний вибір першого ходу
let isHeroTurn = turn === 'hero'; // Хто зараз ходить
let currentLevelIndex = 0;
const dynamicEffects = []; // Для динамічних (одноразових) ефектів
const staticEffects = [];
let levelData = levels[currentLevelIndex];

const selectedCharacterData = JSON.parse(
  localStorage.getItem('selectedCharacter')
);
const selectedCharacter = new Character(
  selectedCharacterData.race,
  selectedCharacterData.name,
  selectedCharacterData.image,
  selectedCharacterData.description,
  selectedCharacterData.characteristics,
  selectedCharacterData.attacks
);

let selectedAttack = selectedCharacter.attacks[0];

function heroTurn(selectedAttack) {
  // Перевірка, чи дійсно герой може здійснити свій хід
  if (!isHeroTurn) return;

  // Перевірка, чи атака була вибрана
  if (!selectedAttack) {
    console.error('No attack selected!');
    return;
  }

  // Перевірка, чи атака доступна
  if (!isAttackAvailable(selectedAttack)) {
    alert('Attack is not available!');
    return;
  }

  console.log('Hero turn with attack:', selectedAttack);

  // Якщо атака - це Berserker's Rage, застосовуємо ефект
  if (selectedAttack.name === "Berserker's Rage") {
    selectedAttack.applyEffect(selectedCharacter); // Застосовуємо ефект
  }

  // Отримуємо характеристику "Magic" героя
  const magicStat = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Magic'
  );

  // Якщо вибрана атака - зцілення
  if (selectedAttack.name === 'Healing') {
    console.log(`Using Healing, Magic Cost: ${selectedAttack.magicCost}`);

    // Перевірка, чи достатньо магії для зцілення
    if (magicStat.value >= selectedAttack.magicCost) {
      // Зцілення: додаємо 2 до здоров'я героя
      selectedCharacter.characteristics.find(
        (stat) => stat.name === 'Health'
      ).value += 2;
      // Витрачаємо магію
      magicStat.value -= selectedAttack.magicCost;
      console.log(
        `Healing applied: +2 Health, Remaining Magic: ${magicStat.value}`
      );
    } else {
      console.log('Not enough magic for Healing');
      alert('Not enough magic to cast Healing!');
    }
  } else {
    // Перевірка, чи є у атаки метод damage
    let damage;
    if (typeof selectedAttack.damage === 'function') {
      // Якщо damage є функцією, викликаємо її для розрахунку пошкодження
      console.log('Calling damage function for attack:', selectedAttack.name);
      damage = selectedAttack.damage(selectedCharacter);
      console.log(damage);
    } else {
      // Якщо damage є значенням, просто використовуємо його
      damage = selectedAttack.damage;
      console.log('Selected is a value');
    }

    // Перевірка, чи значення damage не є undefined або NaN
    if (damage === undefined || isNaN(damage)) {
      console.error('Invalid damage value:', damage);
      return;
    }

    // Розраховуємо захист монстра
    const monsterDefense = levelData.monster.characteristics.find(
      (stat) => stat.name === 'Defense'
    ).value;

    // Вираховуємо фінальне пошкодження з урахуванням захисту
    const finalDamage = Math.max(0, damage - monsterDefense); // Пошкодження не може бути менше 0
    console.log(
      `Attack damage: ${damage}, Monster defense: ${monsterDefense}, Final Damage: ${finalDamage}`
    );

    // Зменшуємо здоров'я монстра на отриману кількість пошкодження
    levelData.monster.characteristics.find(
      (stat) => stat.name === 'Health'
    ).value -= finalDamage;
  }

  // Оновлюємо панелі здоров'я
  updateHealthBars();

  // Зберігаємо стан героя
  saveCharacterState();

  // Перевіряємо, чи гра завершена
  checkGameOver();

  // Завершуємо хід
  endTurn();
}

function isAttackAvailable(attack) {
  if (attack.staminaCost) {
    const stamina = selectedCharacter.characteristics.find(
      (stat) => stat.name === 'Stamina'
    ).value;
    return stamina >= attack.staminaCost;
  }
  if (attack.magicCost) {
    const magic = selectedCharacter.characteristics.find(
      (stat) => stat.name === 'Magic'
    ).value;
    return magic >= attack.magicCost;
  }
  return true; // Якщо немає спеціальних умов
}

function monsterTurn() {
  const randomAttack =
    levelData.monster.attacks[
      Math.floor(Math.random() * levelData.monster.attacks.length)
    ];
  const damage = randomAttack.damage;
  const heroDefense = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Defense'
  ).value;
  const finalDamage = damage - heroDefense > 0 ? damage - heroDefense : 0; // Ensure no negative damage
  console.log(
    `Monster attack: ${randomAttack.name}, Damage: ${damage}, Hero defense: ${heroDefense}, Final Damage: ${finalDamage}`
  );
  selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Health'
  ).value -= finalDamage;
  updateHealthBars();
  saveCharacterState();
  checkGameOver();
  endTurn();
}

function calculateAttackResult(heroAttack, monsterAttack) {
  const missChance = Math.random();
  const fatalityChance = Math.random();

  // Miss - no damage dealt
  if (missChance < 0.2) {
    console.log('Attack missed!');
    return { heroDamage: 0, monsterDamage: 0 };
  }

  // Partial Attack - damage is reduced
  const heroPartialDamage =
    missChance < 0.5
      ? heroAttack.damage * (Math.random() * 0.5 + 0.5)
      : heroAttack.damage;
  const monsterPartialDamage =
    missChance < 0.5
      ? monsterAttack.damage * (Math.random() * 0.5 + 0.5)
      : monsterAttack.damage;

  // Fatality - Hero's attack doubles, monster's attack increases by 4
  if (fatalityChance < 0.1) {
    console.log('Fatality! Hero damage doubled, Monster damage increased by 4');
    return {
      heroDamage: heroAttack.damage * 2,
      monsterDamage: monsterAttack.damage + 4,
    };
  }

  return { heroDamage: heroPartialDamage, monsterDamage: monsterPartialDamage };
}

function endTurn() {
  if (checkGameOver()) {
    return; // Завершити гру, якщо є переможець
  }

  isHeroTurn = !isHeroTurn;
  if (!isHeroTurn) {
    setTimeout(monsterTurn, 1000); // Затримка, щоб симулювати анімацію
  }
}

// ! Функція для випадкового вибору предмета
function getRandomItem() {
  return items[Math.floor(Math.random() * items.length)];
}

// Відображення модального вікна з вибраним предметом
function showItemModal(item) {
  // console.log(item);

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
  if (item && item.dynamic) {
    dynamicEffects.push(item);
  } else {
    if (!staticEffects.some((effect) => effect.name === item.name)) {
      staticEffects.push(item);

      // Застосовуємо статичний ефект до характеристик героя
      if (item && item.effect && item.effect.characteristics) {
        console.log(item);
        console.log(item.effect);
        console.log(item.effect.characteristics);

        const stat = selectedCharacter.characteristics.find(
          (stat) => stat.name === item.effect.characteristics
        );

        console.log(stat);

        if (stat) {
          // Додаємо ефект до характеристики героя
          stat.value += item.effect.value;
          console.log(`Applied effect to ${stat.name}: +${item.effect.value}`);
        }
      }
    }
  }

  // Змінюємо характеристику героя після всіх змін
  updateCharacterStats(); // Переконайтесь, що це викликається після змін
  saveCharacterState();
  updateEffectsDisplay(selectedCharacter);
}

function updateCharacterStats() {
  // Update the character's stats on the UI after effects have been applied
  const statsContainer = document.querySelector('.character-chars');
  console.log(statsContainer);

  if (!statsContainer) {
    console.error('Stats container not found');
    return;
  }

  const healthStat = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Health'
  );
  const defenseStat = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Defense'
  );
  const damageStat = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Damage'
  );

  // Update the displayed values of stats
  if (healthStat) {
    const healthElement = statsContainer.querySelector(
      '.stats:first-child .stat-value'
    );
    if (healthElement) {
      healthElement.textContent = healthStat.value;
    } else {
      console.error('Health stat element not found');
    }
  }
  if (defenseStat) {
    const defenseElement = statsContainer.querySelector(
      '.stats:nth-child(5) .stat-value'
    );
    if (defenseElement) {
      defenseElement.textContent = defenseStat.value;
    } else {
      console.error('Defense stat element not found');
    }
  }
  if (damageStat) {
    const damageElement = statsContainer.querySelector(
      '.stats:nth-child(4) .stat-value'
    );
    if (damageElement) {
      damageElement.textContent = damageStat.value;
    } else {
      console.error('Damage stat element not found');
    }
  }
}

function updateEffectsDisplay(character) {
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

function checkGameOver() {
  const heroHealth = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Health'
  ).value;
  const monsterHealth = levelData.monster.characteristics.find(
    (stat) => stat.name === 'Health'
  ).value;

  if (heroHealth <= 0) {
    alert('Game Over! The monster has won.');
    return true;
  }
  if (monsterHealth <= 0) {
    alert('Victory! You defeated the monster.');
    return true;
  }
  return false;
}

function saveCharacterState() {
  localStorage.setItem('selectedCharacter', JSON.stringify(selectedCharacter));
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

function endBattle(character) {
  character.attacks.forEach((attack) => {
    if (attack.resetEffect) {
      attack.resetEffect(character); // Скидаємо ефекти після бою
    }
  });
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

function updateHealthBars() {
  // Оновлення здоров'я героя
  const heroHealthElement = document.querySelector(
    '#character-details .character-chars .stats .stat-value'
  );
  const heroHealth = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Health'
  ).value;
  if (heroHealthElement) {
    heroHealthElement.textContent = heroHealth;
  }

  // Оновлення здоров'я монстра
  const monsterHealthElement = document.querySelector(
    '#monster-container .character-chars .stats .stat-value'
  );
  const monsterHealth = levelData.monster.characteristics.find(
    (stat) => stat.name === 'Health'
  ).value;
  if (monsterHealthElement) {
    monsterHealthElement.textContent = monsterHealth;
  }
}

document.querySelectorAll('.attack').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const attackName = e.target.closest('.attack').textContent.trim(); // Завжди отримуємо текст кнопки
    selectedAttack = selectedCharacter.attacks.find(
      (attack) => attack.name === attackName
    );

    if (selectedAttack) {
      // Додати перевірку характеристик
      const damageStat = selectedCharacter.getCharacteristic('Damage');
      console.log(damageStat); // Перевірка значення Damage

      heroTurn(selectedAttack);
    }
  });
});

document.getElementById('next-level-btn').addEventListener('click', nextLevel);

document.getElementById('start-battle-btn').addEventListener('click', () => {
  if (isHeroTurn) {
    alert('Your turn to attack!');
    // Handle Hero's turn logic here
  } else {
    alert('Monster is attacking!');
    // Handle Monster's turn logic here
  }

  document.getElementById('start-battle-btn').disabled = true;
});
