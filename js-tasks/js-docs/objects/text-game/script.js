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
Battle
Attack:
1) Full Attack  - full damage from the basic attack or from any other attack
2) Miss  - 0 damage from the basic attack
3) Powerful Strike - full attack x2 from the basic attack

Defense:
1) full defense enemy's attack - all available units
2) Exposed Spot - all available units get lost

! Item Types
1) healing potion +2 health
3) Elixir of Agility +2 stamina
2) fire potion +2 damage
3) magic potion +2 magic
4) bow - +2 damage 
5) sword - +2 damage 
6) swords +2 damage 
7) axe - +2 damage 
8) staff - +2 damage
9) robe - +1 armor
10) shield - +2 armor
11) boots - +1 armor
12) helmet - +1 armor
13) chainmail - +3 armor

! Dark Elf
- Weapon: blades - Shadowfangs +2 damage
- health: 10
- Stamina: 7
- armor: 3
- magic: 3
- Attacks: 
1) Basic Attack - 0 stamina / weapon damage +2 + every additional weapon. An attack that can be deflected.
2) shadow strike - -3 stamina + 3 damage - A strike enhanced by poison
3)


! Mage
- Weapon: magic staff - Starweaver + 3 damage
health: 10
- stamina: 4
- armor: 3
- magic 7
- Attacks: 
1) basic attack - 0 magic / staff damage +3 + every additional weapon. An attack that can be deflected.
2) healing - +2 health -3 magic
3) Lightning Bolt - -3 magic +5 damage + stunning. A direct electric attack with a chance to stun (50/50). An opponent may skip their turn upon a successful attack.

! Wood Elf
- Weapon: bow - Stormstriker + 2 damage
health: 10
- stamina: 8
- armor: 3
- magic 3
- Attacks: 
1) basic attack - 0 magic / bow damage +2 + every additional weapon. An attack that can be deflected.
2) Arrow Rain - -3 stamina x2 basic attack damage. A barrage of arrows hitting an enemy.
3) Eagle Shot - -2 stamina +2 damage. A precise arrow shot.

! Warrior
- Weapon: axe - Thunderhowl +3
health: 10
- stamina: 8
- armor: 4
- magic 2
- Attacks: 
1) basic attack - 0 stamina / axe damage +3 + every additional weapon. An attack that can be deflected.
2) Skullcrusher - -4 stamina +4 damage -1 defense till the end of the round. A heavy blow that stuns enemies and deals massive damage but lowers defense.
3) Berserker's Rage - -6 stamina + 2 basic attack damage till the end of the round. Temporarily boosts attack power.

! Логіка гри
1. Гравець вибирає персонажа - Dark Elf, Wood Elf, Warrior, Mage.
2. Екран розділяється на дві частини. Зліва - гравець, справа - противники (монстри).
3. На екрані видно, які атаки гравець може використовувати та які предмети у нього наявні.
4. Бій відбувається по черзі у вигляді ходів.
5. Гравець може використовувати будь-яку свою ОДНУ атаку під час свого ходу. Якщо є зілля, то можна використовувати також зілля разом із атакою.
6. Атаки монстрів вибираються рандомно.
7. Після кожного раунду, якщо гравець виграє, він забирає у мертвого монстра рандомно виданий предмет із списку (Item Types).
8. Після цього життя гравця відновлюється і він б'ється із наступним монстром.

Додатково:
- Після подолання кожного монстра, якщо життя гравця не менше 4, його рівень росте. Якщо монстрів 5, то максимальний рівень 5-тий після подолання 4-го монстра, тому що 5-тий - це бос.
- з кожним рівнем у гравців ростуть характеристики:
1) у dark elf - з кожним рівнем +1 stamina, і ще одна характеристика рандомно.
1) у wood elf - з кожним рівнем +1 stamina, і ще одна характеристика рандомно.
1) у mage - з кожним рівнем +1 magic, і ще одна характеристика рандомно.
1) у warrior - з кожним рівнем +1 stamina, і ще одна характеристика рандомно.


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
    window.location.href = './battlefield/battlefield.html';
  });

  container.appendChild(card);
});
