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
      .register('./sw.js') // шлях до файлу service worker
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

const audioListContainer = document.getElementById('audio-list');

document.addEventListener('DOMContentLoaded', () => {
  if (typeof google !== 'undefined') {
    initMap();
  }
  getUserLocation();
  setupAudioControls();
});

function setupAudioControls() {
  audioTracks.forEach((track) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${track.title} (${track.location.latitude}, ${track.location.longitude})`;

    const playButton = document.createElement('button');
    playButton.textContent = 'Play';
    playButton.onclick = () => toggleAudioForLocation(track, playButton);

    listItem.appendChild(playButton);
    audioListContainer.appendChild(listItem);
  });
}

function toggleAudioForLocation(track, playButton) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
  }

  if (isPlaying && currentTrack === track) {
    pauseAudioForTrack();
    playButton.textContent = 'Play';
  } else if (!isPlaying && currentTrack === track) {
    resumeAudioForTrack();
    playButton.textContent = 'Stop';
  } else {
    playAudioForTrack(track);
    playButton.textContent = 'Stop';
  }
}

function playAudioForTrack(track) {
  if (currentSource) {
    currentSource.stop();
    currentSource = null;
  }

  fetch(track.audioUrl)
    .then((response) => response.arrayBuffer())
    .then((data) => audioContext.decodeAudioData(data))
    .then((buffer) => {
      currentTrack = track;
      currentSource = audioContext.createBufferSource();
      currentSource.buffer = buffer;
      currentSource.connect(gainNode);
      currentSource.start(0, stopTime);

      lastPlayedUrl = track.audioUrl;
      isPlaying = true;

      currentSource.onended = () => {
        isPlaying = false;
        currentSource = null;
        stopTime = 0;
      };
    })
    .catch((error) => console.error('Помилка при завантаженні аудіо:', error));
}

function pauseAudioForTrack() {
  if (currentSource) {
    currentSource.stop();
    stopTime = audioContext.currentTime;
    isPlaying = false;
  }
}

function resumeAudioForTrack() {
  if (currentTrack && !isPlaying) {
    currentSource = audioContext.createBufferSource();
    fetch(currentTrack.audioUrl)
      .then((response) => response.arrayBuffer())
      .then((data) => audioContext.decodeAudioData(data))
      .then((buffer) => {
        currentSource.buffer = buffer;
        currentSource.connect(gainNode);
        currentSource.start(0, stopTime);
        isPlaying = true;
      });
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
      const listItem = document.createElement('li');
      listItem.textContent = `${track.title} (${track.location.latitude}, ${track.location.longitude})`;

      const playButton = document.createElement('button');
      playButton.textContent = 'Play';
      playButton.onclick = () => toggleAudioForLocation(track, playButton);

      listItem.appendChild(playButton);
      audioListContainer.appendChild(listItem);
    }
  });
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

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const currentLocationDisplay =
          document.getElementById('current-location');
        currentLocationDisplay.innerHTML = `<span>Your Coordinates:</span> <span class="coordinates">Latitude</span> ${latitude.toFixed(
          4
        )}, <span class="coordinates">Longitude</span> ${longitude.toFixed(4)}`;

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
