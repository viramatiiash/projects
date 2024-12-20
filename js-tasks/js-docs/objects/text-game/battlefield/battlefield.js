import { items } from '../items.js';
import { levels } from '../levels.js';
import { Character } from './../characters.js';

const tooltip = document.createElement('div');
tooltip.classList.add('tooltip');
const battleActions = [];

const closeButtonAudio = new Audio('./../assets/audio/levels/button.mp3');
const battleAudio = new Audio('./../assets/audio/levels/battle-music.mp3');

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
let isLevelLoading = false;
let initialHealth = null;
let healthStat = selectedCharacter.characteristics.find(
  (characteristic) => characteristic.name === 'Health'
);

const heroCard = document.getElementById('character-details');
const monsterCard = document.getElementById('monster-container');

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
  console.log(isHeroTurn);

  heroCard.style.animation = 'none';
  monsterCard.style.animation = 'none';

  setTimeout(() => {
    monsterCard.classList.add('filtered');
    heroCard.style.animation = 'pulse 1.5s ease-in-out 1';
    monsterCard.style.animation = 'shake 1s ease-in-out 1';
  }, 50);

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

  if (updatedDamage === 0) {
    updatedDamage = selectedAttack.damage;
  }

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
  if (selectedAttack.name !== 'Healing') {
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
  }

  // ! Berserker Rage
  if (selectedAttack.name === 'Berserker Rage') {
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
    handleHealing(selectedAttack);
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

    if (monsterHealth > 0) {
      setTimeout(() => {
        let audio = document.createElement('audio');
        const monsterDamageSound = levelData.monster.sounds.find(
          (sound) => sound.name === 'Damage'
        );
        audio.src = `../${monsterDamageSound.url}`;
        audio.autoplay = true;
        audio.loop = false;
        document.body.appendChild(audio);
      }, 500);
    }

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
// handle Berserker Rage
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
const handleHealing = (selectedAttack) => {
  console.log(selectedAttack);

  const magicStat = selectedCharacter.characteristics.find(
    (stat) => stat.name === 'Magic'
  );

  console.log(magicStat);

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
      const maxHealth = selectedCharacter.characteristics.find(
        (char) => char.name === 'Health'
      ).defaultValue;

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
  updateCharacterStats();
  updateHealthBars();
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
  monsterCard.classList.remove('filtered');
  monsterCard.style.animation = 'none';
  heroCard.style.animation = 'none';

  setTimeout(() => {
    monsterCard.style.animation = 'pulse 1.5s ease-in-out 1';
    heroCard.style.animation = 'shake 1s ease-in-out 1';
    heroCard.classList.add('filtered');
  }, 50);

  setTimeout(() => {
    heroCard.classList.remove('filtered');
  }, 1050);

  // Генеруємо випадкове число від 0 до 1 для визначення типу атаки
  const randomChance = Math.random();
  let randomAttack =
    levelData.monster.attacks[
      Math.floor(Math.random() * levelData.monster.attacks.length)
    ];
  let audio = document.createElement('audio');
  audio.src = `../${randomAttack.sound}`;
  audio.autoplay = true;
  audio.loop = false;
  document.body.appendChild(audio);
  randomMonsterDamage = randomAttack.damage;

  setTimeout(() => {
    audio = document.createElement('audio');
    const heroDamageSound = selectedCharacter.sounds.find(
      (sound) => sound.name === 'Damage'
    );
    audio.src = `../${heroDamageSound.url}`;
    audio.autoplay = true;
    audio.loop = false;
    document.body.appendChild(audio);
  }, 500);

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

  const heroVictorySound = selectedCharacter.sounds.find(
    (sound) => sound.name === 'Victory'
  );

  const monsterDeathSound = levelData.monster.sounds.find(
    (sound) => sound.name === 'Death'
  );
  const monsterVictorySound = levelData.monster.sounds.find(
    (sound) => sound.name === 'Victory'
  );

  if (heroHealth <= 0) {
    heroCard.classList.add('filtered');
    let audio = document.createElement('audio');
    setTimeout(() => {
      audio.src = `../${heroDeathSound.url}`;
      audio.autoplay = true;
      audio.loop = false;
      document.body.appendChild(audio);
    }, 1200);

    showBattleActions(`<p class="error">Game Over! The monster has won.</p>`);

    setTimeout(() => {
      audio = document.createElement('audio');
      audio.src = `../${monsterVictorySound.url}`;
      audio.autoplay = true;
      audio.loop = false;
      document.body.appendChild(audio);
    }, 1500);

    setTimeout(() => {
      audio = document.createElement('audio');
      audio.src = `./../assets/audio/levels/death.mp3`;
      audio.autoplay = true;
      audio.loop = false;
      document.body.appendChild(audio);
    }, 1700);

    const bloodModal = document.createElement('div');
    bloodModal.classList.add('bloodModal');
    const text = document.createElement('h2');
    text.textContent = "You've lost";
    bloodModal.appendChild(text);
    const body = document.querySelector('body');
    setTimeout(() => {
      body.appendChild(bloodModal);
    }, 1700);

    const restartButton = document.createElement('a');
    restartButton.setAttribute('href', './../index.html');
    restartButton.classList.add('restartButton');
    restartButton.textContent = 'Restart';

    setTimeout(() => {
      bloodModal.appendChild(restartButton);
    }, 1900);

    return true;
  }
  if (monsterHealth <= 0) {
    showBattleActions(`<p class="hero">Victory! You defeated the monster.</p>`);
    showNextLevelButton();

    let audio = document.createElement('audio');

    setTimeout(() => {
      audio.src = `../${monsterDeathSound.url}`;
      audio.autoplay = true;
      audio.loop = false;
      document.body.appendChild(audio);
    }, 1000);

    setTimeout(() => {
      audio = document.createElement('audio');
      audio.src = `../${heroVictorySound.url}`;
      audio.autoplay = true;
      audio.loop = false;
      document.body.appendChild(audio);
    }, 1500);
    return true;
  }
  return false;
}

function saveCharacterState() {
  localStorage.setItem('selectedCharacter', JSON.stringify(selectedCharacter));
}

function loadLevel(levelIndex) {
  heroCard.classList.remove('filtered');
  monsterCard.classList.remove('filtered');
  console.log('load level level index:', levelIndex);

  const levelData = levels[levelIndex];
  console.log('load level:', levelData);
  battleAudio.play();
  battleAudio.volume = 0.4;
  battleAudio.currentTime = 0;
  battleAudio.play().catch((error) => {
    console.error('Cannot play audio:', error);
  });

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
  if (isLevelLoading) return; // Уникаємо повторного виклику
  isLevelLoading = true;

  if (currentLevelIndex < levels.length - 1) {
    console.log(`Current Level: ${currentLevelIndex}`); // Лог для перевірки
    currentLevelIndex++;
    console.log(`Next Level: ${currentLevelIndex}`); // Лог після зміни індексу

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

  setTimeout(() => {
    isLevelLoading = false; // Розблокувати після завантаження
  }, 1000);
}

const increaseHeroLevel = () => {
  selectedCharacter.level++;
  document.getElementById(
    'heroLevel'
  ).textContent = `Level: ${selectedCharacter.level}`;
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
  const battleActionsMobileContainer = document.getElementById(
    'battle-actions-mobile'
  );

  const updateContainers = () => {
    if (window.innerWidth < 1200) {
      battleActionsMobileContainer.style.display = 'block';
      // Якщо екран менший за 1200px, додаємо в мобільний контейнер і видаляємо верхній
      battleActionsMobileContainer.insertAdjacentHTML('beforeend', code);
      battleActionsContainer.innerHTML = ''; // Очищаємо верхній контейнер
    } else {
      battleActionsContainer.style.display = 'block';

      // Якщо екран більше або рівний 1200px, додаємо в звичайний контейнер
      battleActionsContainer.insertAdjacentHTML('beforeend', code);
      battleActionsMobileContainer.innerHTML = ''; // Очищаємо мобільний контейнер
    }
  };

  // Виконуємо функцію при завантаженні сторінки
  updateContainers();

  // Виконуємо функцію при зміні розміру екрану
  window.addEventListener('resize', updateContainers);
};

function decideFirstTurn() {
  // Рандомно обираємо: true (герой) або false (монстр)
  isHeroTurn = Math.random() < 0.5;

  // Відображаємо, хто починає
  if (isHeroTurn) {
    showBattleActions(`<p class="hero">Hero starts the battle!</p>`);
  } else {
    showBattleActions(`<p class="monster">Monster starts the battle!</p>`);
    setTimeout(() => {
      monsterTurn();
    }, 1000);
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

function levelUpModal() {
  const modal = document.getElementById('levelUp');
  modal.classList.remove('modalHidden');
  const stoneImg = document.getElementById('stoneImg');
  console.log('levelUpModal current level index:', currentLevelIndex);

  if (currentLevelIndex === 0) {
    stoneImg.src = '../assets/items/stone-harmony-forest.jpg';
  }
  if (currentLevelIndex === 1) {
    stoneImg.src = '../assets/items/stone-harmony-ice.jpg';
  }
  if (currentLevelIndex === 2) {
    stoneImg.src = '../assets/items/stone-harmony-volcano.jpg';
  }
  if (currentLevelIndex === 3) {
    stoneImg.src = '../assets/items/stone-harmony-rainbow.jpg';
  }
  if (currentLevelIndex === 4) {
    stoneImg.src = './../assets/monsters/boss.jpg';
    document.getElementById('levelUp_title').style.display = 'none';
    document.getElementById('levelUp_text').textContent =
      'The Shadow Lord is defeated!';
    document.getElementById('levelUp_stats').style.display = 'none';
  }

  let audio = document.createElement('audio');
  audio.src = `../assets/audio/levels/next-level.mp3`;
  audio.autoplay = true;
  audio.loop = false;
  document.body.appendChild(audio);

  audio = document.createElement('audio');

  audio.src = `../assets/audio/levels/next-level-2.mp3`;
  audio.autoplay = true;
  audio.loop = false;
  document.body.appendChild(audio);

  let storySoundtrack;
  if (currentLevelIndex <= 3) {
    storySoundtrack = `./../${levels[currentLevelIndex + 1].sound}`;
  } else {
    storySoundtrack = './../assets/audio/levels/win.mp3';
  }

  console.log(storySoundtrack);

  const levelStoryAudio = new Audio(storySoundtrack);
  levelStoryAudio.loop = true;

  const startGameBtn = document.getElementById('closeBtn');
  startGameBtn.replaceWith(startGameBtn.cloneNode(true));
  const newStartGameBtn = document.getElementById('closeBtn');
  newStartGameBtn.addEventListener('click', () => {
    closeButtonAudio.play();
    levelStoryAudio.play();
    modal.classList.add('modalHidden');
    if (currentLevelIndex <= 3) {
      nextLevelStoryModal(levelStoryAudio);
    } else {
      endOfGameModal();
    }
  });
}

const endOfGameModal = () => {
  const modal = document.getElementById('endOfGameModal');
  modal.classList.remove('endOfGameModalClosed');
};

const nextLevelStoryModal = (levelStoryAudio) => {
  const modal = document.getElementById('battleStoryModal');
  modal.classList.remove('storyModalClosed');
  const place = document.getElementById('place');
  const placeDescription = document.getElementById('place-description');
  console.log('next level story modal current level inx:', currentLevelIndex);

  place.textContent = levels[currentLevelIndex + 1].name;
  placeDescription.textContent = levels[currentLevelIndex + 1].description;

  const closeStoryModal = () => {
    modal.classList.add('storyModalClosed');
    levelStoryAudio.pause();
    if (!isLevelLoading) {
      nextLevel();
    }
  };

  const closeModal = document.getElementById('closeModal');
  closeModal.addEventListener('click', () => closeButtonAudio.play());
  closeModal.addEventListener('click', closeStoryModal);
};

nextLevelButton.addEventListener('click', () => battleAudio.pause());
nextLevelButton.addEventListener(
  'click',
  currentLevelIndex <= 3 ? levelUpModal : endOfGameModal
);
const battlefieldContainer = document.getElementById('battlefield-container');
const startLevelButton = document.getElementById('start-battle-btn');

const buttonsContainer = document.createElement('div');
buttonsContainer.classList.add('buttonsContainer');
buttonsContainer.append(startLevelButton, nextLevelButton);
battlefieldContainer.appendChild(buttonsContainer);

startLevelButton.addEventListener('click', () => {
  closeButtonAudio.play();
  decideFirstTurn();

  document.getElementById('start-battle-btn').disabled = true;
});
