const characters = [
  {
    race: 'Dark Elf',
    name: 'Vaelith',
    image: './assets/characters/dark-elf.jpg',
    description:
      'A master of shadow magic and swordplay. A shadow in the darkness, Vaelith is both a protector and an avenger. His people are cursed by the Ancient Lord, and Kael seeks to lift this curse.',
    characteristics: [
      { name: 'Health', value: 100 },
      { name: 'Damage', value: 2 },
      { name: 'Stamina', value: 7 },
      { name: 'Defense', value: 3 },
      { name: 'Magic', value: 3 },
    ],
    attacks: [
      { name: 'Basic Attack', description: 'An ordinary attack...' },
      { name: 'Shadow Strike', description: 'A strike enhanced...' },
      { name: 'Eagle Shot', description: 'A precise arrow shot...' },
    ],
  },
  {
    race: 'Mage',
    name: 'Astralis',
    image: './assets/characters/sorcerer.jpg',
    description:
      'A human girl gifted with magic. Her village was destroyed by the minions of the Ancient Lord. She wields lightning magic against enemies and can heal herself.',
    characteristics: [
      { name: 'Health', value: 100 },
      { name: 'Damage', value: 3 },
      { name: 'Stamina', value: 4 },
      { name: 'Defense', value: 3 },
      { name: 'Magic', value: 7 },
    ],
    attacks: [
      {
        name: 'Basic Attack',
        description: 'Staff damage +3, can be deflected.',
      },
      { name: 'Healing', description: 'Restores health.' },
      {
        name: 'Lightning Bolt',
        description: 'Electric attack with 50% chance to stun.',
      },
    ],
  },
  {
    race: 'Wood Elf',
    name: 'Lorien',
    image: './assets/characters/wood-elf.jpg',
    description:
      'An archer and guardian of the forests. Her mission is to protect the balance of nature, which has now been disrupted.',
    characteristics: [
      { name: 'Health', value: 100 },
      { name: 'Damage', value: 2 },
      { name: 'Stamina', value: 8 },
      { name: 'Defense', value: 3 },
      { name: 'Magic', value: 3 },
    ],
    attacks: [
      { name: 'Basic Attack', description: 'Bow damage +2, can be deflected.' },
      { name: 'Arrow Rain', description: 'A barrage of arrows.' },
      { name: 'Eagle Shot', description: 'A precise arrow shot.' },
    ],
  },
  {
    race: 'Warrior',
    name: 'Tharok',
    image: './assets/characters/warrior.jpg',
    description:
      'A giant from the mountains and a master of the axe. He seeks answers about who destroyed his clan, a trail that leads to the Shadow Lord’s castle.',
    characteristics: [
      { name: 'Health', value: 100 },
      { name: 'Damage', value: 3 },
      { name: 'Stamina', value: 8 },
      { name: 'Defense', value: 4 },
      { name: 'Magic', value: 2 },
    ],
    attacks: [
      { name: 'Basic Attack', description: 'Axe damage +3, can be deflected.' },
      {
        name: 'Skullcrusher',
        description: 'Heavy blow, reduces defense by 1.',
      },
      {
        name: "Berserker's Rage",
        description: 'Temporarily increases attack power.',
      },
    ],
  },
];

export { characters };
