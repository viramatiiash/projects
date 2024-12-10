export const levels = [
  {
    level: 1,
    background: './assets/backgrounds/dark-forest.jpg',
    monster: {
      name: 'Wraithwood',
      image: './assets/monsters/wraithwood.jpg',
      characteristics: [
        { name: 'Health', value: 1 },
        { name: 'Defense', value: 4 },
      ],
      attacks: [
        {
          name: 'Root Snare',
          description:
            'Wraithwood summons roots to entangle and crush the enemy.',
          damage: 7,
          sound: './assets/audio/low-roar.mp3',
        },
        {
          name: 'Bark Shield Bash',
          description: 'A sudden charge using its hardened bark as a weapon.',
          damage: 5,
          sound: './assets/audio/roar.mp3',
        },
      ],
      sounds: [
        { name: 'Damage', url: './assets/audio/monster-pain-3.mp3' },
        { name: 'Victory', url: './assets/audio/monster-growl.mp3' },
        { name: 'Death', url: './assets/audio/monster-death-1.mp3' },
        { name: 'LevelStory', url: './assets/audio/nightmare.mp3' }, // todo
      ],
    },
  },
  {
    level: 2,
    background: './assets/backgrounds/dark-lake.jpg',
    sound: './assets/audio/female-choir.mp3',
    monster: {
      name: 'Drowned Phantom',
      image: './assets/monsters/drowned-phantom.jpg',
      characteristics: [
        { name: 'Health', value: 12 },
        { name: 'Defense', value: 4 },
      ],
      attacks: [
        {
          name: 'Water Whip',
          description: 'A lash of spectral water strikes with crushing force.',
          damage: 6,
          sound: './assets/audio/water-magic.mp3',
        },
        {
          name: 'Drowning Grasp',
          description: 'The phantom tries to drag its victim into the abyss.',
          damage: 8,
          sound: './assets/audio/water-splash.mp3',
        },
      ],
      sounds: [
        { name: 'Damage', url: './assets/audio/woman-pain.mp3' },
        { name: 'Victory', url: './assets/audio/creepy-laugh-2.mp3' },
        { name: 'Death', url: './assets/audio/phantom-death.mp3' },
        { name: 'LevelStory', url: './assets/audio/nightmare.mp3' }, // todo
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
        { name: 'Health', value: 16 },
        { name: 'Defense', value: 4 },
      ],
      attacks: [
        {
          name: 'Infernal Blast',
          description: 'A burst of fire erupts, engulfing everything nearby.',
          damage: 9,
          sound: './assets/audio/fire-magic-3.mp3',
        },
        {
          name: 'Flame Strike',
          description: 'Ifritis swings a fiery arm to strike its enemy.',
          damage: 7,
          sound: './assets/audio/fire-magic-1.mp3',
        },
      ],
      sounds: [
        { name: 'Damage', url: './assets/audio/woman-pain.mp3' },
        { name: 'Victory', url: './assets/audio/creepy-laugh.mp3' },
        { name: 'Death', url: './assets/audio/phantom-death.mp3' },
        { name: 'LevelStory', url: './assets/audio/steps.mp3' },
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
        { name: 'Health', value: 18 },
        { name: 'Defense', value: 4 },
      ],
      attacks: [
        {
          name: 'Horrific Scream',
          description:
            'A banshee-like scream terrifies and disorients its foe.',
          damage: 6,
          sound: './assets/audio/monster-scream.mp3',
        },
        {
          name: 'Phantom Dash',
          description:
            'The Nightmare lunges at its target with blinding speed.',
          damage: 8,
          sound: './assets/audio/speed',
        },
      ],
      sounds: [
        { name: 'Damage', url: './assets/audio/woman-pain.mp3' },
        { name: 'Victory', url: './assets/audio/boss-2.mp3' },
        { name: 'Death', url: './assets/audio/monster-death.mp3' },
        { name: 'LevelStory', url: './assets/audio/nightmare.mp3' },
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
        { name: 'Health', value: 20 },
        { name: 'Defense', value: 4 },
      ],
      attacks: [
        {
          name: 'Void Slash',
          description: 'A blade of shadow slices through space and time.',
          damage: 10,
          sound: './assets/audio/monster-scream.mp3',
        },
        {
          name: 'Dark Pulse',
          description: 'A wave of energy erupts, devouring hope and life.',
          damage: 12,
          sound: './assets/audio/monster-scream.mp3',
        },
      ],
      sounds: [
        { name: 'Damage', url: './assets/audio/woman-pain.mp3' },
        { name: 'Victory', url: './assets/audio/boss-2.mp3' },
        { name: 'Death', url: './assets/audio/monster-death.mp3' },
        { name: 'LevelStory', url: './assets/audio/nightmare.mp3' },
      ],
    },
  },
];
