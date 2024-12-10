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
[] Створи Об'єкти: Визнач об'єкти для гравця, монстрів та предметів з відповідними властивостями та методами.
[] Реалізуй Логіку Бою: Створи логіку для бою між гравцем та монстром, включаючи взаємні атаки та використання предметів.
[] Інтерфейс Користувача: Реалізуй простий текстовий інтерфейс для взаємодії гравця з грою (наприклад, вибір дій, відображення статусу гравця та монстра).
[] Логіка Гри: Створи основну логіку гри, яка включає створення гравця, зустрічі з Dмонстрами, знаходження предметів та умови завершення гри.

? Додатково
[] Додай систему рівнів для гравця, де з кожним рівнем зростають його характеристики.
[] Введи різноманітність монстрів з унікальними властивостями та атаками.
[] Реалізуй систему інвентаря, де гравець може зберігати та використовувати знайдені предмети.

*/

/* 
! Story
The Shadows of Eternity: Game Story
Backstory
In the world of Aldaran, four heroes from different corners of the realm unite to prevent the awakening of the Ancient Shadow Lord, who seeks to plunge the world into darkness once more. According to legend, the Shadow Lord can only be defeated by uniting the power of the Four Stones of Harmony, hidden in the most perilous places of the world. Each hero has their own motivations, but they all know that without this journey, the world is doomed.


Storyline
The Enchanted Dark Forest (Beginning)
The heroes begin their journey in the Dark Forest, where stars are obscured by a veil of magical fog. This place is teeming with ghosts and enchanted trees that come alive to guard the secrets of the Forest’s Heart. The group sets out to find the first Stone of Harmony.
Boss Fight: The Ancient Forest Spirit, driven mad by the curse.
Outcome: The heroes acquire the first Stone of Harmony but learn that the curse is spreading further.
The Fiery Volcano
The path leads to an active volcano, where the second Stone is hidden. The heroes face rivers of lava, underground demons, and scorching winds.
Boss Fight: The Lava Spirit, who guards the Stone of Harmony.
Outcome: The group defeats the fiery spirit and secures the second Stone.
The Desert Lake
In the middle of the desert, the heroes find a mysterious lake that, according to legend, reveals the third Stone only to those who overcome the lake's monstrous guardian.
Obstacles: Illusions, mirages leading them astray, and giant sandworms.
Boss Fight: The Lake Monster, a creature of water and sand.
Outcome: The heroes claim the third Stone of Harmony.
Before the Enchanted Dark Castle
The final stage before the castle: a battlefield where the Shadow Lord’s army clashes with the heroes. The castle is protected by an army of the undead, and the skies are filled with shadow dragons.
Obstacles: Massive battles and coordinated efforts to break through the magical barrier protecting the castle.
Key Task: Defeating powerful monsters to shatter the barrier and gain entry to the castle.
Final Battle: The Dark Castle
In the throne room of the Shadow Lord, the heroes confront his terrifying power.
Boss Fight: The Shadow Lord has three phases, each introducing new attacks:
Phase 1: A physical form wielding a massive shadow blade.
Phase 2: A shadowy form vulnerable only to magic.
Phase 3: A colossal monstrous form fused with dark crystals.
Ending: By uniting all four Stones of Harmony, the heroes perform an ancient ritual that dispels the darkness and destroys the Shadow Lord.
Epilogue
With the world freed from the Shadow Lord, each hero returns home, forever changed. The curse on the dark elf is lifted, the mage casts a spell to banish dark magic, and Torvan finds peace after uncovering the truth about his family. Selena returns to the forest to safeguard the renewed balance of the world.
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
