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
*/