export class Character {
  constructor(race, name, image, description, characteristics, attacks) {
    this.race = race;
    this.name = name;
    this.image = image;
    this.description = description;
    this.characteristics = characteristics;
    this.attacks = attacks;
  }

  // Метод для пошуку характеристики за ім'ям
  getCharacteristic(name) {
    return this.characteristics.find(
      (characteristic) => characteristic.name === name
    );
  }

  // Метод для базової атаки
  basicAttack() {
    const damageStat = this.getCharacteristic('Damage');
    return damageStat ? damageStat.value : 0; // Повертаємо значення Damage
  }

  // Метод для виконання атаки
  performAttack(attackName, target) {
    const attack = this.attacks.find((a) => a.name === attackName);

    if (attack) {
      if (attack.applyEffect) {
        attack.applyEffect(this); // Застосування ефекту до поточного персонажа
      }
      return attack.damage || this.basicAttack();
    }

    return this.basicAttack(); // Якщо атака не знайдена, виконується базова
  }
}

const vaelith = new Character(
  'Dark Elf',
  'Vaelith',
  './assets/characters/dark-elf.jpg',
  'A master of shadow magic and swordplay. A shadow in the darkness, Vaelith is both a protector and an avenger. His people are cursed by the Ancient Lord, and Kael seeks to lift this curse.',
  [
    { name: 'Health', value: 10 },
    { name: 'Damage', value: 2 },
    { name: 'Stamina', value: 7 },
    { name: 'Defense', value: 3 },
    { name: 'Magic', value: 3 },
  ],
  [
    {
      name: 'Basic Attack',
      type: 'damage',
      description:
        'A swift slash with his blade, dealing minimal but reliable damage. Can be deflected.',
      staminaCost: 0,
      damage: 2,
    },
    {
      name: 'Shadow Strike',
      type: 'damage',
      description:
        'A strike enhanced by shadow magic, allowing Vaelith to bypass a portion of the enemy’s defense.',
      staminaCost: 3,
      damage: 5,
    },
    {
      name: 'Night Slash',
      type: 'special',
      description:
        'A swift slash imbued with shadow magic, temporarily reducing the enemy’s defense.',
      staminaCost: 4,
    },
    {
      name: 'Healing',
      type: 'healing',
      description: 'Restores 2 health points to the character.',
      magicCost: 4,
      healing: 2,
    },
  ]
);

const astralis = new Character(
  'Mage',
  'Astralis',
  './assets/characters/sorcerer.jpg',
  'A human girl gifted with magic. Her village was destroyed by the minions of the Ancient Lord. She wields lightning magic against enemies and can heal herself.',
  [
    { name: 'Health', value: 10 },
    { name: 'Damage', value: 3 },
    { name: 'Stamina', value: 4 },
    { name: 'Defense', value: 0 },
    { name: 'Magic', value: 7 },
  ],
  [
    {
      name: 'Basic Attack',
      type: 'damage',
      description: 'Staff damage +3, can be deflected.',
      damage: 3,
    },
    {
      name: 'Healing',
      type: 'healing',
      description: 'Restores 4 health to the Mage.',
      magicCost: 3,
      healing: 4,
    },
    {
      name: 'Lightning Bolt',
      type: 'damage',
      description:
        'Electric attack with 50% chance to stun, when the enemy skips the move.',
      magicCost: 5,
      damage: 4,
    },
  ]
);

const lorien = new Character(
  'Wood Elf',
  'Lorien',
  './assets/characters/wood-elf.jpg',
  'An archer and guardian of the forests. Her mission is to protect the balance of nature, which has now been disrupted.',
  [
    { name: 'Health', value: 100 },
    { name: 'Damage', value: 2 },
    { name: 'Stamina', value: 100 },
    { name: 'Defense', value: 3 },
    { name: 'Magic', value: 6 },
  ],
  [
    {
      name: 'Basic Attack',
      type: 'damage',
      description: 'Bow damage, can be deflected.',
      damage: 2,
    },
    {
      name: 'Arrow Rain',
      type: 'damage',
      description: 'A barrage of arrows.',
      staminaCost: 4,
      damage: 5,
    },
    {
      name: 'Focus of the Forest',
      type: 'special',
      description:
        'Harnesses the power of the forest to double the base attack power until the end of the battle.',
      staminaCost: 5,
    },
    {
      name: 'Healing',
      type: 'special',
      description: 'Restores 2 health to the Wood Elf.',
      magicCost: 4,
      healing: 2,
    },
  ]
);

const tharok = new Character(
  'Warrior',
  'Tharok',
  './assets/characters/warrior.jpg',
  'A giant from the mountains and a master of the axe. He seeks answers about who destroyed his clan, a trail that leads to the Shadow Lord’s castle.',
  [
    { name: 'Health', value: 10 },
    { name: 'Damage', value: 3 },
    { name: 'Stamina', value: 8 },
    { name: 'Defense', value: 4 },
    { name: 'Magic', value: 2 },
  ],
  [
    {
      name: 'Basic Attack',
      type: 'damage',
      description: 'Ordinary axe damage, can be deflected.',
      damage: 3,
    },
    {
      name: 'Skullcrusher',
      type: 'damage',
      description: 'Heavy blow, reduces defense by 1.',
      damage: 5,
      staminaCost: 4,
      defense: -1,
    },
    {
      name: "Berserker's Rage",
      type: 'special',
      description: 'Temporarily increases attack power.',
      staminaCost: 5,
    },
    {
      name: 'Healing',
      type: 'special',
      description: 'Restores 2 health to the Warrior.',
      magicCost: 4,
      healing: 2,
    },
  ]
);
export const characters = [vaelith, astralis, lorien, tharok];
