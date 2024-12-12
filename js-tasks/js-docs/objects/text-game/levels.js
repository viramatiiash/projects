export const levels = [
  {
    level: 1,
    background: './assets/backgrounds/dark-forest.jpg',
    name: 'The Enchanted Dark Forest',
    description:
      'The hero begins his/her journey in the Dark Forest, where stars are obscured by a veil of magical fog. This place is teeming with ghosts and enchanted trees that come alive to guard the secrets of the Forest’s Heart - the first Stone of Harmony.',
    sound: './assets/audio/levels/level-1/story.mp3',

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
          sound: './assets/audio/levels/level-1/low-roar.mp3',
        },
        {
          name: 'Bark Shield Bash',
          description: 'A sudden charge using its hardened bark as a weapon.',
          damage: 5,
          sound: './assets/audio/levels/level-1/roar.mp3',
        },
      ],
      sounds: [
        {
          name: 'Damage',
          url: './assets/audio/levels/level-1/monster-pain-3.mp3',
        },
        {
          name: 'Victory',
          url: './assets/audio/levels/level-1/monster-growl.mp3',
        },
        {
          name: 'Death',
          url: './assets/audio/levels/level-1/monster-death-1.mp3',
        },
      ],
    },
  },
  {
    level: 2,
    background: './assets/backgrounds/dark-lake.jpg',
    name: 'The Ice Lake',
    description:
      "In the middle of the Forest, the hero finds a mysterious lake that, according to legend, reveals the second Stone only to those who overcome the lake's monstrous guardian.",
    sound: './assets/audio/female-choir.mp3',
    monster: {
      name: 'Drowned Phantom',
      image: './assets/monsters/drowned-phantom.jpg',
      characteristics: [
        { name: 'Health', value: 1 },
        { name: 'Defense', value: 4 },
      ],
      attacks: [
        {
          name: 'Water Whip',
          description: 'A lash of spectral water strikes with crushing force.',
          damage: 6,
          sound: './assets/audio/levels/level-2/water-magic.mp3',
        },
        {
          name: 'Drowning Grasp',
          description: 'The phantom tries to drag its victim into the abyss.',
          damage: 8,
          sound: './assets/audio/levels/level-2/water-splash.mp3',
        },
      ],
      sounds: [
        { name: 'Damage', url: './assets/audio/levels/level-2/woman-pain.mp3' },
        {
          name: 'Victory',
          url: './assets/audio/levels/level-2/creepy-laugh-2.mp3',
        },
        {
          name: 'Death',
          url: './assets/audio/levels/level-2/phantom-death.mp3',
        },
        // {
        //   name: 'LevelStory',
        //   url: './assets/audio/levels/level-2/frogs-choir.mp3',
        // },
      ],
    },
  },
  {
    level: 3,
    background: './assets/backgrounds/volcano.jpg',
    name: 'The Fiery Volcano',
    description:
      'The path leads to an active volcano, where the third Stone is hidden. The heroes face rivers of lava, underground demons, and scorching winds.',
    sound: './assets/audio/levels/level-3/steps.mp3',
    monster: {
      name: 'Ifritis',
      image: './assets/monsters/ifritis.jpg',
      characteristics: [
        { name: 'Health', value: 1 },
        { name: 'Defense', value: 4 },
      ],
      attacks: [
        {
          name: 'Infernal Blast',
          description: 'A burst of fire erupts, engulfing everything nearby.',
          damage: 9,
          sound: './assets/audio/levels/level-3/fire-magic-3.mp3',
        },
        {
          name: 'Flame Strike',
          description: 'Ifritis swings a fiery arm to strike its enemy.',
          damage: 7,
          sound: './assets/audio/levels/level-3/fire-magic-1.mp3',
        },
      ],
      sounds: [
        {
          name: 'Damage',
          url: './assets/audio/levels/level-3/ifritis-pain-2.mp3',
        },
        {
          name: 'Victory',
          url: './assets/audio/levels/level-3/creepy-laugh.mp3',
        },
        {
          name: 'Death',
          url: './assets/audio/levels/level-3/ifritis-pain.mp3',
        },
      ],
    },
  },
  {
    level: 4,
    background: './assets/backgrounds/dark-castle.jpg',
    name: 'The Enchanted Dark Castle',
    description:
      'A battlefield where the Shadow Lord’s army clashes with the heroes. The castle is protected by an army of the undead, and the skies are filled with shadow dragons and nightmares.',
    sound: './assets/audio/levels/level-4/nightmare.mp3',
    monster: {
      name: 'Nightmare',
      image: './assets/monsters/nightmare.jpg',
      characteristics: [
        { name: 'Health', value: 1 },
        { name: 'Defense', value: 4 },
      ],
      attacks: [
        {
          name: 'Horrific Scream',
          description:
            'A banshee-like scream terrifies and disorients its foe.',
          damage: 6,
          sound: './assets/audio/levels/level-4/monster-scream.mp3',
        },
        {
          name: 'Phantom Dash',
          description:
            'The Nightmare lunges at its target with blinding speed.',
          damage: 8,
          sound: './assets/audio/levels/level-4/speed.mp3',
        },
      ],
      sounds: [
        {
          name: 'Damage',
          url: './assets/audio/levels/level-4/nightmare-pain.mp3',
        },
        {
          name: 'Victory',
          url: './assets/audio/levels/level-4/monster-sing.mp3',
        },
        {
          name: 'Death',
          url: './assets/audio/levels/level-4/monster-death.mp3',
        },
      ],
    },
  },
  {
    level: 5,
    background: './assets/backgrounds/thone-hall.jpg',
    name: 'The Dark Castle Throne Hall',
    description:
      'In the throne room of the Shadow Lord, the heroes confront his terrifying power.',
    sound: './assets/audio/levels/level-5/battle-music.mp3',
    monster: {
      name: 'Dark Lord',
      image: './assets/monsters/boss.jpg',
      characteristics: [
        { name: 'Health', value: 1 },
        { name: 'Defense', value: 4 },
      ],
      attacks: [
        {
          name: 'Void',
          description: 'A blade of shadow slices through space and time.',
          damage: 10,
          sound: './assets/audio/levels/level-5/void.mp3',
        },
        {
          name: 'Dark Pulse',
          description: 'A wave of energy erupts, devouring hope and life.',
          damage: 12,
          sound: './assets/audio/levels/level-5/dark-pulse.mp3',
        },
      ],
      sounds: [
        { name: 'Damage', url: './assets/audio/levels/level-5/boss-pain.mp3' },
        {
          name: 'Victory',
          url: './assets/audio/levels/level-5/boss-victory.mp3',
        },
        { name: 'Death', url: './assets/audio/levels/level-5/boss-dying.wav' },
        {
          name: 'Battle',
          url: './assets/audio/levels/level-5/battle-music-boss.mp3',
        },
      ],
    },
  },
];
