export const items = [
  {
    name: 'Healing Potion',
    type: 'health',
    image: './assets/items/healing-potion.jpg',
    effect: {
      characteristics: 'Health',
      value: 2,
    },
    description: 'Restores 2 health points.',
    dynamic: true,

  },
  {
    name: 'Elixir of Agility',
    type: 'stamina',
    image: './assets/items/stamina-potion.jpg',
    effect: {
      characteristics: 'Stamina',
      value: 2,
    },
    description: 'Increases stamina by 2 points.',
    dynamic: true,
  },
  // {
  //   name: 'Fire Potion',
  //   type: 'health',
  //   image: './assets/items/fire-potion.jpg',
  //   effect: {
  //     characteristics: 'Damage',
  //     value: 2,
  //   },
  //   description: 'Adds 2 extra damage points in attacks.',
  //   dynamic: true,
  // },
  {
    name: 'Magic Potion',
    type: 'magic',
    image: './assets/items/magic-potion.jpg',
    effect: {
      characteristics: 'Magic',
      value: 2,
    },
    description: 'Boosts magic power by 2 points.',
    dynamic: true,
  },
  {
    name: 'Swords',
    type: 'damage',
    image: './assets/items/battle-swords.png',
    effect: {
      characteristics: 'Damage',
      value: 2,
    },
    description: 'Increases melee attack damage by 2 points.',
    dynamic: false,
  },
  {
    name: 'Mage Robe',
    type: 'armor',
    image: './assets/items/mage-robe.jpg',
    effect: {
      characteristics: 'Defense',
      value: 1,
    },
    description: 'Light robe that adds 1 point of armor.',
    dynamic: false,
  },
  {
    name: 'Shield',
    type: 'armor',
    image: './assets/items/shield.jpg',
    effect: {
      characteristics: 'Defense',
      value: 2,
    },
    description: 'Provides 2 extra points of armor.',
    dynamic: false,
  },
  {
    name: 'Boots',
    type: 'armor',
    image: './assets/items/boots.jpeg',
    effect: {
      characteristics: 'Defense',
      value: 1,
    },
    description: 'Light boots with 1 additional armor point.',
    dynamic: false,
  },
  {
    name: 'Helmet',
    type: 'armor',
    image: './assets/items/helmet.jpg',
    effect: {
      characteristics: 'Defense',
      value: 1,
    },
    description: 'Protects the head with 1 extra armor point.',
    dynamic: false,
  },
  {
    name: 'Chainmail',
    type: 'armor',
    image: './assets/items/chainmail.jpg',
    effect: {
      characteristics: 'Defense',
      value: 3,
    },
    description: 'Sturdy chainmail adding 3 armor points.',
    dynamic: false,
  },
];
