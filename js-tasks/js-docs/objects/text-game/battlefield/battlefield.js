import { items } from '../items.js';
import { levels } from '../levels.js';
import { Character, characters } from './../characters.js';

const tooltip = document.createElement('div');
tooltip.classList.add('tooltip');
const battleActions = [];

let currentLevelIndex = 0;
let levelData = levels[currentLevelIndex];
const nextLevelButton = document.getElementById('next-level-btn');
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

let initialHealth = null;
let healthStat = selectedCharacter.characteristics.find(
  (characteristic) => characteristic.name === 'Health'
);
console.log(healthStat);

initialHealth = healthStat.value;
console.log(initialHealth);

const monsterHealth = levelData.monster.characteristics.find(
  (stat) => stat.name === 'Health'
).value;

let selectedAttack = selectedCharacter.attacks[0];
let turn = Math.random() > 0.5 ? 'hero' : 'monster'; // Рандомний вибір першого ходу
let isHeroTurn = turn === 'hero'; // Хто зараз ходить

const dynamicEffects = []; // Для динамічних (одноразових) ефектів
const staticEffects = [];

function heroTurn(selectedAttack) {
  // Перевірка, чи дійсно герой може здійснити свій хід
  if (!isHeroTurn) return;

  // Перевірка, чи атака була вибрана
  if (!selectedAttack) {
    console.error('No attack selected!');
    return;
  }

  showBattleActions(
    `<p class="selectedAttackParagraph">- <span class="hero">Hero</span> is taking his/her turn with attack: <span class="selectedAttackName">${selectedAttack.name}</span></p>`
  );

  // Отримуємо характеристику "Stamina" героя
  const staminaStat = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Stamina'
  );

  // Якщо атака вимагає stamina, перевіряємо та витрачаємо
  if (selectedAttack.staminaCost) {
    if (!staminaStat || staminaStat.value < selectedAttack.staminaCost) {
      showBattleActions(
        `<p class="error">- Not enough stamina for this attack</p>`
      );
      return;
    }

    // Зменшуємо значення stamina
    staminaStat.value -= selectedAttack.staminaCost;
    updateCharacterStats();
  }

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
      const healingAmount = selectedAttack.healing || 2; // Використовуємо поле healing або за замовчуванням 2
      const healthStat = selectedCharacter.getCharacteristic('Health');

      if (healthStat) {
        healthStat.value += healingAmount;

        // Логіка для обмеження здоров'я (якщо потрібно, наприклад, maxHealth)
        const maxHealth =
          selectedCharacter.getCharacteristic('MaxHealth')?.value;
        if (maxHealth && healthStat.value > maxHealth) {
          healthStat.value = maxHealth; // Обмеження до максимального здоров'я
        }

        // Витрачаємо магію
        magicStat.value -= selectedAttack.magicCost;
        console.log(
          `Healing applied: +${healingAmount} Health, Remaining Magic: ${magicStat.value}`
        );
      } else {
        console.error('Health characteristic not found for the character.');
      }
    } else {
      showBattleActions(`<p class="error">- Not enough magic for Healing</p>`);
    }
  } else {
    // Перевірка, чи є у атаки метод damage
    let damage;
    if (typeof selectedAttack.damage === 'function') {
      console.log('Calling damage function for attack:', selectedAttack.name);
      damage = selectedAttack.damage(selectedCharacter);
      console.log(damage);
    } else {
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
    showBattleActions(
      `<p class="selectedAttackParagraph">- <span class="hero">Hero</span> attack damage: <span class="selectedAttackName">${damage}</span>, <span class="monster">Monster</span> defense: <span class="selectedAttackName">${monsterDefense}</span>, Final Damage: <span class="selectedAttackName">${finalDamage}</span></p>`
    );

    // Зменшуємо здоров'я монстра на отриману кількість пошкодження
    levelData.monster.characteristics.find(
      (stat) => stat.name === 'Health'
    ).value -= finalDamage;
  }

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
  return true;
}

function monsterTurn() {
  const randomAttack =
    levelData.monster.attacks[
      Math.floor(Math.random() * levelData.monster.attacks.length)
    ];
  showBattleActions(
    `<p class="selectedAttackParagraph">- <span class="monster">Monster</span> is taking its turn with attack: <span class="selectedAttackName">${randomAttack.name}</span>.</p>`
  );

  const damage = randomAttack.damage;
  const heroDefense = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Defense'
  ).value;
  const finalDamage = damage - heroDefense > 0 ? damage - heroDefense : 0;
  showBattleActions(
    `<p class="selectedAttackParagraph">- <span class="monster">Monster</span> attack damage: <span class="selectedAttackName">${damage}</span>, <span class="hero">Hero</span> defense: <span class="selectedAttackName">${heroDefense}</span>, Final Damage: <span class="selectedAttackName">${finalDamage}</span></p>`
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
    return;
  }

  isHeroTurn = !isHeroTurn;
  if (!isHeroTurn) {
    setTimeout(monsterTurn, 1000);
  }
}

// ! Функція для випадкового вибору предмета
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
  closeModalBtn.removeEventListener('click', closeModalHandler);
  closeModalBtn.addEventListener('click', closeModalHandler, { once: true });

  function closeModalHandler() {
    modal.classList.add('hidden');
    addEffectToHero(item);
  }
}

function addEffectToHero(item) {
  if (item && item.dynamic) {
    dynamicEffects.push(item);
    showBattleActions(
      `<p class="selectedAttackParagraph">Hero gets: <span class="selectedAttackName">${item.name}</span></p>`
    );
  } else {
    if (!staticEffects.some((effect) => effect.name === item.name)) {
      staticEffects.push(item);

      if (item && item.effect && item.effect.characteristics) {
        const stat = selectedCharacter.characteristics.find(
          (stat) => stat.name === item.effect.characteristics
        );
        if (stat) {
          stat.value += item.effect.value;
          showBattleActions(
            `<p class="selectedAttackParagraph">Applied effect to ${stat.name}: <span class="selectedAttackName">+${item.effect.value}</span></p>`
          );
        }
      }
    }
  }
  saveCharacterState();
  updateEffectsDisplay();
  updateCharacterStats();
}

function applyDynamicEffect(item) {
  if (!item || !item.effect) return;

  const stat = selectedCharacter.characteristics.find(
    (stat) => stat.name === item.effect.characteristics
  );

  if (stat && stat.name === 'Health') {
    stat.value = Math.min(stat.value + item.effect.value, initialHealth);
    showBattleActions(
      `<p class="selectedAttackParagraph">Applied dynamic effect to ${stat.name}: <span class="selectedAttackName">+${item.effect.value}</span></p>`
    );
  } else if (stat && stat.name !== 'Health') {
    stat.value += item.effect.value;
    showBattleActions(
      `<p class="selectedAttackParagraph">Applied dynamic effect to ${stat.name}: <span class="selectedAttackName">+${item.effect.value}</span></p>`
    );
  }

  saveCharacterState();
  updateCharacterStats();
}

function onItemIconClick(item) {
  if (item.dynamic) {
    applyDynamicEffect(item);

    const index = dynamicEffects.findIndex((effect) => {
      const match = effect.name === item.name;
      return match;
    });

    if (index !== -1) {
      dynamicEffects.splice(index, 1);
    } else {
      showBattleActions(
        `<p class="selectedAttackParagraph">Item not found in dynamicEffects</p>`
      );
    }
    updateEffectsDisplay();
  }
}

function updateCharacterStats() {
  const statsContainer = document.querySelector('.character-chars');

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

  const staminaStat = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Stamina'
  );

  const magicStat = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Magic'
  );

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
  if (magicStat) {
    const magicElement = statsContainer.querySelector(
      '.stats:nth-child(5) .stat-value'
    );

    if (magicElement) {
      magicElement.textContent = magicStat.value;
    } else {
      console.error('Health stat element not found');
    }
  }
  if (damageStat) {
    const damageElement = statsContainer.querySelector(
      '.stats:nth-child(2) .stat-value'
    );

    if (damageElement) {
      damageElement.textContent = damageStat.value;
    } else {
      console.error('Damage stat element not found');
    }
  }
  if (staminaStat) {
    const staminaElement = statsContainer.querySelector(
      '.stats:nth-child(3) .stat-value'
    );

    if (staminaElement) {
      staminaElement.textContent = staminaStat.value;
    } else {
      console.error('Stamina stat element not found');
    }
  }
  if (defenseStat) {
    const defenseElement = statsContainer.querySelector(
      '.stats:nth-child(4) .stat-value'
    );

    if (defenseElement) {
      defenseElement.textContent = defenseStat.value;
    } else {
      console.error('Defense stat element not found');
    }
  }
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

    effectElement.dataset.itemName = effect.name;
    dynamicContainer.appendChild(effectElement);
    effectElement.addEventListener('click', () => {
      onItemIconClick(effect);
    });
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
    showBattleActions(`<p class="error">Game Over! The monster has won.</p>`);
    return true;
  }
  if (monsterHealth <= 0) {
    showBattleActions(`<p class="hero">Victory! You defeated the monster.</p>`);
    showNextLevelButton();
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
  const heroHealthElement = document.querySelector(
    '#character-details .character-chars .stats .stat-value'
  );
  const heroHealth = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Health'
  ).value;
  if (heroHealthElement) {
    heroHealthElement.textContent = heroHealth;
  }

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

function showNextLevelButton() {
  nextLevelButton.classList.add('active');
}

const showBattleActions = (code) => {
  console.log(code);

  const battleActionsContainer = document.getElementById('battle-actions');
  battleActionsContainer.insertAdjacentHTML('beforeend', code);
};

document.querySelectorAll('.attack').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const attackName = e.target.closest('.attack').textContent.trim();
    selectedAttack = selectedCharacter.attacks.find(
      (attack) => attack.name === attackName
    );

    if (selectedAttack) {
      heroTurn(selectedAttack);
    }
  });
});

nextLevelButton.addEventListener('click', nextLevel);
const battlefieldContainer = document.getElementById('battlefield-container');
const startLevelButton = document.getElementById('start-battle-btn');

const buttonsContainer = document.createElement('div');
buttonsContainer.classList.add('buttonsContainer');
buttonsContainer.append(startLevelButton, nextLevelButton);
battlefieldContainer.appendChild(buttonsContainer);

startLevelButton.addEventListener('click', () => {
  if (isHeroTurn) {
    console.log('Hero starts');
  } else {
    console.log('Monster starts');
    monsterTurn();
  }

  document.getElementById('start-battle-btn').disabled = true;
});
