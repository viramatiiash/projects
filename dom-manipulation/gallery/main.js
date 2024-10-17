/* // ! Завдання 0:

[] - Створіть динамічну галерею зображень з наступними функціональностями:
[+] - Додавання нового зображення через форму (URL та опис).
[+] - Видалення зображення.
[] - Показ великого зображення при натисканні на маленьке зображення (lightbox ефект).
[] - Перехід між зображеннями в lightbox режимі.
*/

// ? Image for attemts: https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4800b028-0f13-4e00-823c-e6f27bb63730/dftu4wx-644bef89-0d8e-4062-acc4-4c0f3c7df919.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzQ4MDBiMDI4LTBmMTMtNGUwMC04MjNjLWU2ZjI3YmI2MzczMFwvZGZ0dTR3eC02NDRiZWY4OS0wZDhlLTQwNjItYWNjNC00YzBmM2M3ZGY5MTkuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.YhUlx_9b4Xtg33NS4zzm1ME599PnxV14JcSIkLoFpHU

const form = document.getElementById('form');
const gallery = document.getElementById('gallery');
const btn = document.getElementById('btn');

const images = [];

const displayImages = () => {
  gallery.innerHTML = '';
  images.forEach((image, index) => {
    // create img and desc container
    const div = document.createElement('div');
    div.classList.add('img-container');

    // Create img and p elements
    const addImg = document.createElement('img');
    addImg.setAttribute('src', image.url);
    const addImgDesc = document.createElement('p');
    addImgDesc.innerText = image.imgDesc;
    addImgDesc.classList.add('img-desc');

    // Create a delete btn
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerText = 'Delete';

    deleteBtn.addEventListener('click', () => {
      images.splice(index, 1);
      displayImages();
    });

    div.appendChild(addImg);
    div.appendChild(addImgDesc);
    div.appendChild(deleteBtn);

    // add img container into the gallery
    gallery.appendChild(div);
  });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get image url input and description input
  const url = document.getElementById('url').value.trim();
  const imgDesc = document.getElementById('img-desc').value.trim();

  images.push({ url, imgDesc });
  displayImages();

  form.reset();
});
