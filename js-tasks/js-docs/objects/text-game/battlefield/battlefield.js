import { items } from '../items.js';
import { levels } from '../levels.js';
import { Character } from './../characters.js';

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
  selectedCharacterData.level,
  selectedCharacterData.name,
  selectedCharacterData.image,
  selectedCharacterData.description,
  selectedCharacterData.characteristics,
  selectedCharacterData.attacks,
  selectedCharacterData.sounds
);

let initialHealth = null;
let healthStat = selectedCharacter.characteristics.find(
  (characteristic) => characteristic.name === 'Health'
);

initialHealth = healthStat.value;

const monsterHealth = levelData.monster.characteristics.find(
  (stat) => stat.name === 'Health'
).value;

let initialHeroHealth = selectedCharacter.characteristics.find(
  (characteristic) => characteristic.name === 'Health'
);
console.log(initialHeroHealth);

let selectedAttack;
let updatedDamage;
let randomDamage;
let randomMonsterDamage;
let turn = Math.random() > 0.5 ? 'hero' : 'monster'; // Рандомний вибір першого ходу
let isHeroTurn = turn === 'hero'; // Хто зараз ходить

const dynamicEffects = []; // Для динамічних (одноразових) ефектів
const staticEffects = [];

// ! Hero Turn
function heroTurn(selectedAttack) {
  if (
    selectedAttack.type === 'damage' &&
    selectedAttack.name !== 'Basic Attack'
  ) {
    updatedDamage = selectedAttack.damage;
  } else {
    updatedDamage = selectedCharacter.characteristics.find(
      (stat) => stat.name === 'Damage'
    ).value;
  }
  console.log(selectedAttack);
  console.log('initial damage: ', updatedDamage);

  if (updatedDamage === 0) {
    updatedDamage = selectedAttack.damage;
  }

  console.log(updatedDamage);

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

  const staminaStat = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Stamina'
  );

  if (selectedAttack.staminaCost) {
    if (!staminaStat || staminaStat.value < selectedAttack.staminaCost) {
      showBattleActions(
        `<p class="error">- Not enough stamina for this attack</p>`
      );
      return;
    }

    staminaStat.value -= selectedAttack.staminaCost;
    updateCharacterStats();
  }

  const magicStat = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Magic'
  );

  if (selectedAttack.magicCost) {
    if (!magicStat || magicStat.value < selectedAttack.magicCost) {
      showBattleActions(
        `<p class="error">- Not enough magic for this attack</p>`
      );
      return;
    }

    magicStat.value -= selectedAttack.magicCost;
    updateCharacterStats();
  }

  // ! Berserker's Rage
  if (selectedAttack.name === "Berserker's Rage") {
    handleBerserkersRage();
  }

  // ! Focus of the Forest
  if (selectedAttack.name === 'Focus of the Forest') {
    handleFocusOfForest();
  }

  // ! Night Slash
  if (selectedAttack.name === 'Night Slash') {
    handleNightSlash();
  }

  // ! Healing
  if (selectedAttack.name === 'Healing') {
    handleHealing();
  }
  console.log(updatedDamage);
  if (selectedAttack.name === 'Basic Attack') {
    selectedAttack.damage = updatedDamage;
  }
  // Розраховуємо захист монстра
  const monsterDefense = levelData.monster.characteristics.find(
    (stat) => stat.name === 'Defense'
  ).value;
  console.log(
    'updated Damage before apply Special Attack Effect: ',
    updatedDamage
  );

  if (selectedAttack.type === 'damage') {
    applySpecialAttackEffects({ ...selectedAttack, damage: updatedDamage });

    console.log(selectedAttack);

    console.log('random damage:', randomDamage);

    // Вираховуємо фінальне пошкодження з урахуванням захисту
    const finalDamage = Math.max(0, randomDamage - monsterDefense);
    console.log(updatedDamage);
    // Пошкодження не може бути менше 0
    showBattleActions(
      `<p class="selectedAttackParagraph">- <span class="hero">Hero</span> attack damage: <span class="selectedAttackName">${randomDamage}</span>, <span class="monster">Monster</span> defense: <span class="selectedAttackName">${monsterDefense}</span>, Final Damage: <span class="selectedAttackName">${finalDamage}</span></p>`
    );
    // updatedDamage = selectedAttack.damage;

    // Зменшуємо здоров'я монстра на отриману кількість пошкодження
    levelData.monster.characteristics.find(
      (stat) => stat.name === 'Health'
    ).value -= finalDamage;
  }
  updateHealthBars();
  saveCharacterState();
  checkGameOver();
  endTurn();
}

// ! Special Attacks
// handle Berserker's Rage
const handleBerserkersRage = () => {
  const statsContainer = document.querySelector('.character-chars');

  if (!statsContainer) {
    console.error('Stats container not found');
    return;
  }
  const damageStat = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Damage'
  );

  updatedDamage = damageStat.value;
  updatedDamage += 2;
  damageStat.value = updatedDamage;
  const damageElement = statsContainer.querySelector(
    '.stats:nth-child(2) .stat-value'
  );

  if (damageElement) {
    damageElement.textContent = updatedDamage;
  } else {
    console.error('Damage stat element not found');
  }

  let defenseStat = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Defense'
  );
  if (defenseStat) {
    defenseStat.value += 2;
    const defenseElement = statsContainer.querySelector(
      '.stats:nth-child(4) .stat-value'
    );

    if (defenseElement) {
      defenseElement.textContent = defenseStat.value;
    } else {
      console.error('Defense stat element not found');
    }
    saveCharacterState();
    updateCharacterStats();
  }
};

// handle Focus Of the Forest
const handleFocusOfForest = () => {
  const statsContainer = document.querySelector('.character-chars');

  if (!statsContainer) {
    console.error('Stats container not found');
    return;
  }
  const damageStat = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Damage'
  );
  updatedDamage *= 2;
  damageStat.value = updatedDamage;
  const damageElement = statsContainer.querySelector(
    '.stats:nth-child(2) .stat-value'
  );

  if (damageElement) {
    damageElement.textContent = updatedDamage;
  } else {
    console.error('Defense stat element not found');
  }

  saveCharacterState();
};

// Handle Night Slash
const handleNightSlash = () => {
  const monsterDefense = levelData.monster.characteristics.find(
    (stat) => stat.name === 'Defense'
  ).value;

  const statsContainer = document.querySelector(
    '#monster-container .character-chars'
  );
  console.log(statsContainer);

  if (monsterDefense) {
    const defenseElement = statsContainer.querySelector(
      '.stats:nth-child(2) .stat-value'
    );

    if (defenseElement) {
      const updatedDefense = monsterDefense - 3;
      defenseElement.textContent = updatedDefense;

      // Оновіть дані в levelData
      const monsterDefenseStat = levelData.monster.characteristics.find(
        (stat) => stat.name === 'Defense'
      );
      if (monsterDefenseStat) {
        monsterDefenseStat.value = updatedDefense;
      }
    } else {
      console.error('Defense stat element not found');
    }
  }
  saveCharacterState();
  updateCharacterStats();
};

// Handle Healing
const handleHealing = () => {
  console.log(`Using Healing, Magic Cost: ${selectedAttack.magicCost}`);
  const magicStat = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Magic'
  );

  if (selectedAttack.magicCost) {
    if (!magicStat || magicStat.value < selectedAttack.magicCost) {
      showBattleActions(
        `<p class="error">- Not enough magic for this attack</p>`
      );
      return;
    }
  }
  // Перевірка, чи достатньо магії для зцілення
  if (magicStat.value >= selectedAttack.magicCost) {
    const healingAmount = selectedAttack.healing || 2; // Використовуємо поле healing або за замовчуванням 2
    const healthStat = selectedCharacter.getCharacteristic('Health');

    if (healthStat) {
      healthStat.value += healingAmount;

      // Логіка для обмеження здоров'я (якщо потрібно, наприклад, maxHealth)
      const maxHealth = selectedCharacter.getCharacteristic('MaxHealth')?.value;
      if (maxHealth && healthStat.value > maxHealth) {
        healthStat.value = maxHealth; // Обмеження до максимального здоров'я
      }

      // Витрачаємо магію
      magicStat.value -= selectedAttack.magicCost;

      showBattleActions(
        `<p class="selectedAttackParagraph">- Healing applied: <span class="selectedAttackName">+${healingAmount}</span> Health, Remaining Magic: <span class="selectedAttackName">${magicStat.value}</span></p>`
      );
    } else {
      console.error('Health characteristic not found for the character.');
    }
  } else {
    showBattleActions(`<p class="error">- Not enough magic for Healing</p>`);
  }
  saveCharacterState();
  endTurn();
  return;
};

function applySpecialAttackEffects(selectedAttack) {
  console.log(selectedAttack);

  const randomChance = Math.random();
  // let randomDamage;
  console.log(randomChance);

  // Визначаємо, який ефект застосовуємо
  if (randomChance <= 0.4) {
    randomDamage = selectedAttack.damage;
    console.log(randomDamage);

    showBattleActions(
      `<p class="selectedAttackParagraph">- Full attack: <span class="error">${randomDamage}!</span></p>`
    );
  } else if (randomChance <= 0.85) {
    const randomMultiplier = Math.random() * (0.99 - 0.01) + 0.01;
    randomDamage = selectedAttack.damage * randomMultiplier;
    randomDamage = Math.round(randomDamage);
    console.log(randomDamage);

    showBattleActions(
      `<p class="selectedAttackParagraph">- Random damage: <span class="error">${randomDamage}</span> with <span class="selectedAttackName">${selectedAttack.name}</span></p>`
    );
  } else if (randomChance <= 0.9) {
    randomDamage = 0;
    console.log(randomDamage);

    showBattleActions(
      `<p class="miss">- Attack missed: <span class="error">${randomDamage}!</span></p>`
    );
  } else {
    randomDamage = selectedAttack.damage * 2;
    console.log(randomDamage);

    showBattleActions(
      `<p class="selectedAttackParagraph">- Fatality! Critical hit: <span class="error">${randomDamage}!</span></p>`
    );
  }
  // updatedDamage = randomDamage;
  updateCharacterStats();
  saveCharacterState();
}

function monsterTurn() {
  // Генеруємо випадкове число від 0 до 1 для визначення типу атаки
  const randomChance = Math.random();
  let randomAttack =
    levelData.monster.attacks[
      Math.floor(Math.random() * levelData.monster.attacks.length)
    ];
  randomMonsterDamage = randomAttack.damage;
  console.log('random monster damage:', randomMonsterDamage);
  console.log('random attack damage:', randomAttack.damage);

  // Генеруємо випадкову атаку залежно від шансів
  if (randomChance <= 0.4) {
    // 40% ймовірність для повної атаки
    randomMonsterDamage;
    showBattleActions(
      `<p class="selectedAttackParagraph">- <span class="monster">Monster</span> is taking its turn with Full attack: <span class="selectedAttackName">${randomAttack.name}</span>.</p>`
    );
  } else if (randomChance <= 0.85) {
    // 45% ймовірність для випадкової атаки
    // Генеруємо випадкову атаку, подібно до випадкової атаки героя
    const randomMultiplier = Math.random() * (0.99 - 0.01) + 0.01; // Множник від 1% до 99%
    randomMonsterDamage = Math.round(randomMonsterDamage * randomMultiplier);
    showBattleActions(
      `<p class="selectedAttackParagraph">- <span class="monster">Monster</span> is taking its turn with Random damage: <span class="selectedAttackName">${randomAttack.name}</span>, Damage: <span class="error">${randomMonsterDamage}</span></p>`
    );
  } else if (randomChance <= 0.9) {
    // 5% ймовірність для промаху
    randomMonsterDamage = 0;
    showBattleActions(
      `<p class="miss">- <span class="monster">Monster</span> attack missed!</p>`
    );
  } else {
    // 5% ймовірність для фаталіті

    randomMonsterDamage *= 2; // Фаталіті дає подвоєний урон
    showBattleActions(
      `<p class="selectedAttackParagraph">- <span class="monster">Monster</span> used Fatality! Critical hit: <span class="error">${randomMonsterDamage}</span></p>`
    );
  }

  // Обчислюємо фінальний урон з урахуванням захисту героя
  const heroDefense = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Defense'
  ).value;
  const finalDamage =
    randomMonsterDamage - heroDefense > 0
      ? randomMonsterDamage - heroDefense
      : 0;

  showBattleActions(
    `<p class="selectedAttackParagraph">- <span class="monster">Monster</span> attack damage: <span class="selectedAttackName">${randomMonsterDamage}</span>, <span class="hero">Hero</span> defense: <span class="selectedAttackName">${heroDefense}</span>, Final Damage: <span class="selectedAttackName">${finalDamage}</span></p>`
  );

  // Оновлюємо здоров'я героя
  selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Health'
  ).value -= finalDamage;
  randomMonsterDamage = randomAttack.damage;
  // Оновлюємо статус здоров'я
  updateHealthBars();
  saveCharacterState();
  checkGameOver();
  endTurn();
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
    let audio = document.createElement('audio');
    audio.src = `../assets/audio/items/stamina-potion.mp3`;
    audio.autoplay = true;
    audio.loop = false;
    document.body.appendChild(audio);
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
        updatedDamage += item.effect.value;
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
      let audio = document.createElement('audio');
      audio.src = `../assets/audio/items/drinking-potion.mp3`;
      audio.autoplay = true;
      audio.loop = false;
      document.body.appendChild(audio);
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

  const heroDeathSound = selectedCharacter.sounds.find(
    (sound) => sound.name === 'Death'
  );

  console.log(heroDeathSound);
  

  if (heroHealth <= 0) {
    let audio = document.createElement('audio');
    audio.src = `../${heroDeathSound.url}`;
    audio.autoplay = true;
    audio.loop = false;
    document.body.appendChild(audio);
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
    increaseHeroLevel();
    resetHeroEffects();

    changeMonster();
    const startBattleBtn = document.getElementById('start-battle-btn');
    startBattleBtn.disabled = false;
    nextLevelButton.classList.remove('active');

    // Очищаємо поле битви від попередніх дій
    const battleActionsContainer = document.getElementById('battle-actions');
    battleActionsContainer.innerHTML = '';
  } else {
    alert('Congratulations! You have completed all levels!');
  }
}

const increaseHeroLevel = () => {
  selectedCharacter.level++;
  document.getElementById(
    'heroLevel'
  ).textContent = `Level: ${selectedCharacter.level}`;

  // if (selectedCharacter.level > 1) {
  //   selectedCharacter.characteristics.forEach((stat) => {
  //     // Якщо це не статичні характеристики, скидаємо їх
  //     if (stat.name) {
  //       stat.value++; // Повертаємо до значення за замовчуванням
  //     }
  //   });
  // }
};

function resetHeroEffects() {
  // Припустимо, що "additionalEffects" зберігає динамічні ефекти героя
  selectedCharacter.characteristics.forEach((stat, index) => {
    // Якщо це не статичні характеристики, скидаємо їх
    if (stat.name) {
      stat.value = stat.defaultValue || stat.value;
      stat.value = stat.value + selectedCharacter.level - 1; // Повертаємо до значення за замовчуванням
    }
  });
  if (staticEffects) {
    staticEffects.map((item) => {
      updatedDamage += item.effect.value;
      const stat = selectedCharacter.characteristics.find(
        (stat) => stat.name === item.effect.characteristics
      );
      if (stat) {
        stat.value += item.effect.value;
      }
    });
  }

  // Оновлюємо відображення характеристик героя
  updateHealthBars();
  showBattleActions(
    `<p class="hero">Hero's effects have been reset for the next level.</p>`
  );
}

function changeMonster() {
  const newMonsterData = levels[currentLevelIndex].monster; // Отримуємо нового монстра для поточного рівня
  levelData.monster = { ...newMonsterData }; // Оновлюємо монстра в даних гри

  updateMonsterUI();
}

function updateMonsterUI() {
  const monsterHealthElement = document.querySelector(
    '#monster-container .character-chars .stat-value'
  );
  const monsterHealth = levelData.monster.characteristics.find(
    (stat) => stat.name === 'Health'
  ).value;
  if (monsterHealthElement) {
    monsterHealthElement.textContent = monsterHealth;
  }

  // Можна також оновити інші характеристики монстра
  // Оновлюємо атаку монстра, якщо потрібно
  const monsterAttacksElement = document.querySelector(
    '#monster-container .character-attacks'
  );
  if (monsterAttacksElement) {
    monsterAttacksElement.innerHTML = levelData.monster.attacks
      .map(
        (attack) =>
          `<button class="attack"><span>${attack.name}</span></button>`
      )
      .join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadLevel(currentLevelIndex);
});

if (selectedCharacter) {
  const characterContainer = document.querySelector('#character-details');
  characterContainer.innerHTML = `
    <h3 class="battle-name">${selectedCharacter.name}</h3>
    <h4 id="heroLevel">Level: ${selectedCharacter.level}</h4>
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
  const battleActionsContainer = document.getElementById('battle-actions');
  battleActionsContainer.insertAdjacentHTML('beforeend', code);
};

function decideFirstTurn() {
  // Рандомно обираємо: true (герой) або false (монстр)
  isHeroTurn = Math.random() < 0.5;

  // Відображаємо, хто починає
  if (isHeroTurn) {
    showBattleActions(`<p class="hero">Hero starts the battle!</p>`);
  } else {
    showBattleActions(`<p class="monster">Monster starts the battle!</p>`);
    monsterTurn();
  }
}

document.querySelectorAll('.attack').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const attackName = e.target.closest('.attack').textContent.trim();
    const selectedAttack = selectedCharacter.attacks.find(
      (attack) => attack.name === attackName
    );

    if (!selectedAttack) {
      console.error('Attack not found:', attackName);
      return;
    }

    console.log('Selected attack:', selectedAttack);

    // Перевіряємо чи аудіо вже існує
    let audio = document.querySelector(`#audio-${attackName}`);
    if (!audio) {
      // Створюємо аудіо лише якщо його ще немає
      audio = document.createElement('audio');
      audio.id = `audio-${attackName}`;
      audio.src = `../${selectedAttack.sound}`;
      audio.autoplay = true; // Автоматичне програвання
      audio.loop = false; // Повторення можна увімкнути за потреби
      document.body.appendChild(audio); // Додаємо до DOM
    } else {
      // Перезапускаємо існуюче аудіо
      audio.currentTime = 0; // Починаємо з початку
      audio.play();
    }

    // Виклик функції атаки
    heroTurn(selectedAttack);
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
  decideFirstTurn();

  document.getElementById('start-battle-btn').disabled = true;
});
