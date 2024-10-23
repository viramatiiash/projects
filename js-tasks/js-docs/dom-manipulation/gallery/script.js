/* // ! Завдання 0:

[+] - Створіть динамічну галерею зображень з наступними функціональностями:
[+] - Додавання нового зображення через форму (URL та опис).
[+] - Видалення зображення.
[+] - Показ великого зображення при натисканні на маленьке зображення (lightbox ефект).
[+] - Перехід між зображеннями в lightbox режимі.
*/

// ? Image for testing: https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4800b028-0f13-4e00-823c-e6f27bb63730/dftu4wx-644bef89-0d8e-4062-acc4-4c0f3c7df919.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzQ4MDBiMDI4LTBmMTMtNGUwMC04MjNjLWU2ZjI3YmI2MzczMFwvZGZ0dTR3eC02NDRiZWY4OS0wZDhlLTQwNjItYWNjNC00YzBmM2M3ZGY5MTkuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.YhUlx_9b4Xtg33NS4zzm1ME599PnxV14JcSIkLoFpHU

const form = document.getElementById('form');
const gallery = document.getElementById('gallery');
const btn = document.getElementById('btn');
const bigImg = document.getElementById('big-img');

const images = [];
let currentIndex = 0;

const displayImages = () => {
  gallery.innerHTML = '';
  images.forEach((image, index) => {
    // ! create img and desc container
    const div = document.createElement('div');
    div.classList.add('img-container');

    // ! Create img and p elements
    const addImg = document.createElement('img');
    addImg.setAttribute('src', image.url);
    const addImgDesc = document.createElement('p');
    addImgDesc.innerText = image.imgDesc;
    addImgDesc.classList.add('img-desc');

    // ! Create a delete btn
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerText = 'Delete';

    deleteBtn.addEventListener('click', () => {
      images.splice(index, 1);
      displayImages();
    });

    // ! Open modal
    addImg.addEventListener('click', () => {
      currentIndex = index;
      openModal(index);
    });

    bigImg.addEventListener('click', () => {
      bigImg.classList.remove('active');
    });

    div.appendChild(addImg);
    div.appendChild(addImgDesc);
    div.appendChild(deleteBtn);

    // add img container into the gallery
    gallery.appendChild(div);
  });
};

// ! Open Modal Function
const openModal = (index) => {
  bigImg.classList.add('active');
  bigImg.innerHTML = '';
  const modal = document.createElement('img');
  modal.src = images[index].url;
  bigImg.appendChild(modal);
  modal.classList.add('modal');

  // ! Add navigation buttons
  const prevBtn = document.createElement('button');
  prevBtn.innerText = 'Prev';
  prevBtn.classList.add('nav-btn', 'prev-btn');
  prevBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    navigateImg(-1);
  });

  const nextBtn = document.createElement('button');
  nextBtn.innerText = 'Next';
  nextBtn.classList.add('nav-btn', 'next-btn');
  nextBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    navigateImg(1);
  });

  bigImg.appendChild(prevBtn);
  bigImg.appendChild(nextBtn);
};

// ! Image navigation function
const navigateImg = (direction) => {
  currentIndex += direction;

  if (currentIndex < 0) {
    currentIndex = images.length - 1;
  } else if (currentIndex >= images.length) {
    currentIndex = 0;
  }

  openModal(currentIndex);
};

// ! Submit Event
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get image url input and description input
  const url = document.getElementById('url').value.trim();
  const imgDesc = document.getElementById('img-desc').value.trim();

  images.push({ url, imgDesc });
  displayImages();

  form.reset();
});
