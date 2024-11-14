/*
Завдання: Локаційно-орієнтований аудіо гід з використанням Geolocation і Web Audio API

Опис завдання: Створіть веб-додаток, який використовує Geolocation API для визначення місця знаходження користувача та Web Audio API для відтворення аудіогідів залежно від локації.

Технічні вимоги:

[+] Визначення локації користувача: Використовуйте Geolocation API для отримання точного місця знаходження користувача.

[+] Відтворення аудіо залежно від локації: Інтегруйте Web Audio API для створення і відтворення аудіо треків, які змінюються в залежності від того, де знаходиться користувач.

[+] Динамічна зміна контенту: Реалізуйте логіку, що дозволяє автоматично завантажувати та відтворювати нові аудіо треки, коли користувач переміщається до нових локацій.

[+] Кешування аудіо для офлайн використання: Використовуйте Service Workers для кешування аудіо контенту, щоб користувачі могли використовувати додаток без інтернет з'єднання.

[+] Інтерфейс користувача: Розробіть користувацький інтерфейс, який показує поточну локацію користувача на мапі та доступні аудіо треки.

*/

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((registration) => {
        console.log('Service Worker зареєстровано:', registration);
      })
      .catch((error) => {
        console.error('Помилка реєстрації service worker:', error);
      });
  });
}

const locations = [
  { latitude: 49.8397, longitude: 24.0297, title: 'Lviv' },
  { latitude: 52.2298, longitude: 21.0118, title: 'Warsaw' },
  { latitude: 52.52, longitude: 13.405, title: 'Berlin' },
  { latitude: 41.3784, longitude: 2.1925, title: 'Barcelona' },
  { latitude: 48.8566, longitude: 2.3522, title: 'Paris' },
  { latitude: 35.6895, longitude: 139.6917, title: 'Tokyo' },
  { latitude: 59.9139, longitude: 10.7522, title: 'Oslo' },
  { latitude: 19.4326, longitude: -99.1332, title: 'Mexico' },
  { latitude: 30.0444, longitude: 31.2357, title: 'Cairo' },
];

const audioTracks = [
  {
    title: 'Михайло Кривень - Пісня про Івано-Франківськ',
    audioUrl: './assets/audio/ivano-frankivsk.mp3',
    location: { latitude: 48.9225, longitude: 24.7107 },
  },
  {
    title: 'Скрябін - То є Львів',
    audioUrl: './assets/audio/to-ye-lviv.mp3',
    location: { latitude: 49.8397, longitude: 24.0297 },
  },
  {
    title: 'МюсліUA - Kurva Bobr',
    audioUrl: './assets/audio/varshava.mp3',
    location: { latitude: 52.2298, longitude: 21.0118 },
  },
  {
    title: 'Rammstein - Rammstein',
    audioUrl: './assets/audio/berlin.mp3',
    location: { latitude: 52.52, longitude: 13.405 },
  },
  {
    title: 'Rammstein - Deutschland',
    audioUrl: './assets/audio/berlin-2.mp3',
    location: { latitude: 52.52, longitude: 13.405 },
  },
  {
    title:
      'Spanish Music (Barcelona Madrid Valencia Sevilla Latin Spain Theme)',
    audioUrl: './assets/audio/barcelona.mp3',
    location: { latitude: 41.3784, longitude: 2.1925 },
  },
  {
    title: 'French Traditional Music (Accordion Paris Waltz Background Intro)',
    audioUrl: './assets/audio/paris.mp3',
    location: { latitude: 48.8566, longitude: 2.3522 },
  },
  {
    title: 'moodmode - Adventure Hunter',
    audioUrl: './assets/audio/texas.mp3',
    location: { latitude: 30.2672, longitude: -97.7431 },
  },
  {
    title: 'Monument_Music - Asian Spirit',
    audioUrl: './assets/audio/tokyo.mp3',
    location: { latitude: 35.6895, longitude: 139.6917 },
  },
  {
    title: 'OB-LIX - Skjaldmær Norse - Viking Background Music',
    audioUrl: './assets/audio/oslo.mp3',
    location: { latitude: 59.9139, longitude: 10.7522 },
  },
  {
    title: 'White_Records - Latin reggaeton hip hop',
    audioUrl: './assets/audio/mexiko.mp3',
    location: { latitude: 19.4326, longitude: -99.1332 },
  },
  {
    title: 'BackgroundMusicForVideo - Arabic Music (Middle East Desert Egypt)',
    audioUrl: './assets/audio/cairo.mp3',
    location: { latitude: 30.0444, longitude: 31.2357 },
  },
];

let map;
let audioContext;
let gainNode;
let currentSource = null;
let lastPlayedUrl = null;
let isPlaying = false;
let stopTime = 0;
let currentTrack = null;

const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>`;
const pauseIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg>`;
const volumeIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z"/></svg>`;
const volumeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z"/></svg>`;

const audioListContainer = document.getElementById('audio-list');

document.addEventListener('DOMContentLoaded', () => {
  if (typeof google !== 'undefined') {
    initMap();
  }
  getUserLocation();
  setupAudioControls();
});

function parseSVG(svgString) {
  const parser = new DOMParser();
  return parser.parseFromString(svgString, 'image/svg+xml').documentElement;
}

function song(track) {
  const listItem = document.createElement('li');
  listItem.textContent = `${track.title} (${track.location.latitude}, ${track.location.longitude})`;

  const audio = document.createElement('audio');
  audio.src = track.audioUrl;

  const progress = document.createElement('input');
  progress.type = 'range';
  progress.value = 0;
  progress.classList.add('progress-bar');

  const volumeRange = document.createElement('input');
  volumeRange.type = 'range';
  volumeRange.value = 100;
  volumeRange.classList.add('volume-control');
  const volumeContainer = document.createElement('div');
  volumeContainer.classList.add('volumeContainer');
  volumeContainer.innerHTML = volumeIcon;
  volumeContainer.append(volumeRange);

  volumeContainer.addEventListener('click', () => {
    volumeRange.classList.toggle('active');
  });

  const playPauseButton = document.createElement('button');
  playPauseButton.innerHTML = playIcon;

  playPauseButton.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playPauseButton.innerHTML = pauseIcon;
    } else {
      audio.pause();
      playPauseButton.innerHTML = playIcon;
    }
  });

  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttonsContainer');
  buttonsContainer.append(volumeContainer, playPauseButton)

  audio.addEventListener('timeupdate', () => {
    progress.max = audio.duration;
    progress.value = audio.currentTime;
  });

  progress.addEventListener('input', () => {
    audio.currentTime = progress.value;
  });

  volumeRange.addEventListener('input', () => {
    audio.volume = volumeRange.value / 100;

    if (volumeRange.value == 0) {
      volumeContainer.appendChild(svgString(volumeOffIcon));
    } else {
      volumeContainer.appendChild(svgString(volumeIcon));
    }
  });

  const controls = document.createElement('div');
  controls.classList.add('controls');
  const bars = document.createElement('div');
  bars.classList.add('bars');
  bars.append(progress, buttonsContainer);
  controls.appendChild(bars);

  listItem.append(audio, controls);
  audioListContainer.appendChild(listItem);
}

function setupAudioControls() {
  audioTracks.forEach((track) => {
    song(track);
  });
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        document.getElementById('current-location').innerHTML = `
          <span>Your Coordinates:</span> <span class="coordinates">Latitude</span> ${latitude.toFixed(
            4
          )}, 
          <span class="coordinates">Longitude</span> ${longitude.toFixed(4)}
        `;
        updateAudioList(latitude, longitude);
        const userLocation = { lat: latitude, lng: longitude };
        new google.maps.Marker({
          position: userLocation,
          map: map,
          title: 'Ваше розташування',
        });
        map.setCenter(userLocation);
      },
      (error) => console.error('Error getting location:', error),
      { enableHighAccuracy: true }
    );
  } else {
    alert('Geolocation не підтримується браузером.');
  }
}

function updateAudioList(latitude, longitude) {
  audioListContainer.innerHTML = '';
  audioTracks.forEach((track) => {
    const distance = getDistanceFromLatLonInKm(
      latitude,
      longitude,
      track.location.latitude,
      track.location.longitude
    );
    if (distance < 300) {
      song(track);
    }
  });
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

window.initMap = function () {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 50.4501, lng: 30.5234 },
    zoom: 9,
    styles: mapStyle,
    mapTypeControl: false,
    zoomControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    scaleControl: false,
    rotateControl: false,
    keyboardShortcuts: false,
    panControl: false,
  });
  getUserLocation();
};
