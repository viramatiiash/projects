/*
! Завдання 6: Створення Веб-Слайдера на JavaScript
Опис Завдання
Створи інтерактивний веб-слайдер для показу зображень або текстових блоків, який може бути інтегрований у будь-який веб-сайт. Слайдер має дозволяти користувачам переглядати слайди вручну та автоматично через заданий інтервал часу.

? Основні Технічні Вимоги

[] Підтримка Нескінченного Циклу: Слайди повинні повторюватись безперервно.
[] Адаптивність: Слайдер має адаптуватися до розміру вікна перегляду.
[] Анімація Переходів: Плавні анімації переходу між слайдами.
[] Управління: Кнопки для перегляду наступного і попереднього слайду, а також навігація для швидкого переходу до конкретного слайду.

? Завдання
[] Створення HTML та CSS Шаблону: Розробіть базовий HTML-шаблон та стилі для слайдера.

Логіка JavaScript:
[] Ініціалізація Слайдера: Визначення початкових налаштувань слайдера, включаючи встановлення таймера для автоматичної зміни слайдів.
[] Функції Навігації: Реалізація кнопок для переміщення між слайдами і точок навігації.
[] Адаптивність: Автоматичне коригування розмірів слайдера відповідно до зміни розміру вікна браузера.
[] Анімація Переходів: Додавання анімації для плавного переходу між слайдами.
[] Тестування та Оптимізація: Перевірка слайдера на різних пристроях та веб-браузерах для забезпечення стабільної роботи та відповідності вимогам.
Додаткові Можливості
[] Ліниве Завантаження (Lazy Loading): Реалізація лінивого завантаження зображень для покращення швидкості завантаження сторінки.
[] Інтеграція з API: Можливість інтеграції з зовнішніми джерелами для автоматичного завантаження зображень чи тексту через API.
[] Підтримка Свайпів на Мобільних Пристроях: Додавання підтримки жестів свайпу для навігації між слайдами на мобільних пристроях.

Це завдання допоможе розробити навички у різних аспектах веб-розробки, включаючи анімацію, адаптивний дизайн і роботу з подіями в JavaScript.
*/

import { sliderInfos } from './info.js';

const slider = document.getElementById('slider');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const pagination = document.getElementById('pagination');

let currentIndex = 0;
const gap = 100;
let slideWidth = 0;

for (let i = 0; i < sliderInfos.length; i++) {
  const paginationDot = document.createElement('div');
  paginationDot.classList.add('paginationDot');

  pagination.appendChild(paginationDot);
}

const updateSlideWidth = () => {
  const slides = document.querySelectorAll('.slide');
  slideWidth = slides[0]?.offsetWidth || 0;
  if (slideWidth === 0) {
    console.error('Slide width is invalid. Check your DOM or CSS.');
  }
};

const loadSlide = () => {
  sliderInfos.forEach((slide) => {
    const card = document.createElement('div');
    card.classList.add('slide');

    const title = document.createElement('h2');
    title.classList.add('title');
    title.textContent = slide.title;

    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = slide.description;

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('imgContainer');
    const img = document.createElement('img');
    img.classList.add('image');
    img.src = slide.imgUrl;
    img.alt = slide.title;
    imgContainer.appendChild(img);

    card.append(title, description, imgContainer);
    slider.appendChild(card);
  });
};

const handlePrev = () => {
  if (currentIndex > 0) {
    currentIndex -= 1;
  } else {
    currentIndex = sliderInfos.length - 1;
  }
  updateSliderPosition();
};

const handleNext = () => {
  if (currentIndex < sliderInfos.length - 1) {
    currentIndex += 1;
  } else {
    currentIndex = 0;
  }
  updateSliderPosition();
};

const updateSliderPosition = () => {
  if (slideWidth > 0) {
    const offset = -(currentIndex * (slideWidth + gap)); // Розрахунок зміщення

    slider.style.transform = `translateX(${offset}px)`; // Зміщення слайдеру
  } else {
    console.error('Slide width is invalid. Check your DOM or CSS.');
  }
};

const updatePaginationActiveDot = () => {
  const paginationDots = document.querySelectorAll('.paginationDot');
  paginationDots.forEach((dot, index) => {
    dot.classList.remove('dotActive');
    if (index === currentIndex) {
      dot.classList.add('dotActive');
    }
  });
};

const handlePaginationClick = (event) => {
  const clickedDot = event.target;
  if (clickedDot.classList.contains('paginationDot')) {
    currentIndex = Array.from(clickedDot.parentNode.children).indexOf(
      clickedDot
    );
    updateSliderPosition();
    updatePaginationActiveDot();
  }
};

loadSlide();
updateSlideWidth();

btnPrev.addEventListener('click', handlePrev);
btnNext.addEventListener('click', handleNext);
pagination.addEventListener('click', handlePaginationClick);



// setInterval(() => {
//   handleNext();
// }, 5000);
