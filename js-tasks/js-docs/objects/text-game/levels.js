export const levels = [
  {
    level: 1,
    background: './assets/backgrounds/dark-forest.jpg',
    monster: {
      name: 'Wraithwood',
      image: './assets/monsters/wraithwood.jpg',
      characteristics: [
        { name: 'Health', value: 14 },
        { name: 'Defense', value: 4 },
      ],
      attacks: [
        {
          name: 'Root Snare',
          description:
            'Wraithwood summons roots to entangle and crush the enemy.',
          damage: 7,
        },
        {
          name: 'Bark Shield Bash',
          description: 'A sudden charge using its hardened bark as a weapon.',
          damage: 5,
        },
      ],
    },
  },
  {
    level: 2,
    background: './assets/backgrounds/dark-lake.jpg',
    monster: {
      name: 'Drowned Phantom',
      image: './assets/monsters/drowned-phantom.jpg',
      characteristics: [
        { name: 'Health', value: 20 },
        { name: 'Defense', value: 4 },
      ],
      attacks: [
        {
          name: 'Water Whip',
          description: 'A lash of spectral water strikes with crushing force.',
          damage: 6,
        },
        {
          name: 'Drowning Grasp',
          description: 'The phantom tries to drag its victim into the abyss.',
          damage: 8,
        },
      ],
    },
  },
  {
    level: 3,
    background: './assets/backgrounds/volcano.jpg',
    monster: {
      name: 'Ifritis',
      image: './assets/monsters/ifritis.jpg',
      characteristics: [
        { name: 'Health', value: 25 },
        { name: 'Defense', value: 4 },
      ],
      attacks: [
        {
          name: 'Infernal Blast',
          description: 'A burst of fire erupts, engulfing everything nearby.',
          damage: 9,
        },
        {
          name: 'Flame Strike',
          description: 'Ifritis swings a fiery arm to strike its enemy.',
          damage: 7,
        },
      ],
    },
  },
  {
    level: 4,
    background: './assets/backgrounds/dark-castle.jpg',
    monster: {
      name: 'Nightmare',
      image: './assets/monsters/nightmare.jpg',
      characteristics: [
        { name: 'Health', value: 30 },
        { name: 'Defense', value: 4 },
      ],
      attacks: [
        {
          name: 'Horrific Scream',
          description:
            'A banshee-like scream terrifies and disorients its foe.',
          damage: 6,
        },
        {
          name: 'Phantom Dash',
          description:
            'The Nightmare lunges at its target with blinding speed.',
          damage: 8,
        },
      ],
    },
  },
  {
    level: 5,
    background: './assets/backgrounds/thone-hall.jpg',
    monster: {
      name: 'Dark Lord',
      image: './assets/monsters/boss.jpg',
      characteristics: [
        { name: 'Health', value: 35 },
        { name: 'Defense', value: 4 },
      ],
      attacks: [
        {
          name: 'Void Slash',
          description: 'A blade of shadow slices through space and time.',
          damage: 10,
        },
        {
          name: 'Dark Pulse',
          description: 'A wave of energy erupts, devouring hope and life.',
          damage: 12,
        },
      ],
    },
  },
];
