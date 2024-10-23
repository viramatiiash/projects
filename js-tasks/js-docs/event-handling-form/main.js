const form = document.getElementById('form');
const btn = document.getElementById('submit-btn');
const inputs = document.getElementsByTagName('input');
const success = document.querySelector('.success');
const passwordInput = document.getElementById('password');
const charCount = document.querySelector('.char-count');
const tooltipName = document.getElementById('tooltip-name');
const tooltipEmail = document.getElementById('tooltip-email');
const tooltipPassword = document.getElementById('tooltip-password');

// ! Error Messages
const errorMessageName = document.getElementById('error-message_name');
const errorMessageEmail = document.getElementById('error-message_email');
const errorMessagePassword = document.getElementById('error-message_password');

// ? Focus Event
for (let input of inputs) {
  input.addEventListener('focus', () => {
    input.style.borderColor = 'orange';

    if (errorMessageName.innerText === '' && input.id === 'name') {
      tooltipName.classList.add('active');
      tooltipName.innerText = '*Please type your name';
    } else if (errorMessageEmail.innerText === '' && input.id === 'email') {
      tooltipEmail.classList.add('active');
      tooltipEmail.innerText = '*Please type your email';
    } else if (
      errorMessagePassword.innerText === '' &&
      input.id === 'password'
    ) {
      tooltipPassword.classList.add('active');
      tooltipPassword.innerText = '*Please type your password';
    }
  });
}

// ? Blur Event
for (let input of inputs) {
  input.addEventListener('blur', () => {
    input.style.borderColor = 'transparent';
    tooltipName.classList.remove('active');
    tooltipEmail.classList.remove('active');
    tooltipPassword.classList.remove('active');
  });
}

// ? Input Event
passwordInput.addEventListener('input', () => {
  const currentValue = passwordInput.value;
  charCount.innerText = `${currentValue.length}/500`;
});

// ? Submit Event
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // ! Inputs
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  console.log(success);

  errorMessageName.innerText = '';
  errorMessageEmail.innerText = '';
  errorMessagePassword.innerText = '';

  let isValid = true;

  // ! Name input validation
  if (name === '') {
    errorMessageName.innerText = '*Please enter your name';
    isValid = false;
  }

  // ! Email validation
  const emailValidationReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === '') {
    errorMessageEmail.innerText = '*Please enter your email';
  }
  if (email !== '' && !emailValidationReg.test(email)) {
    errorMessageEmail.innerText = '*Please enter a valid email address';
    isValid = false;
  }

  // ! Password validation
  if (password === '') {
    errorMessagePassword.innerText = '*Please enter your password';
    isValid = false;
  }
  if (password !== '' && password.length < 6) {
    errorMessagePassword.innerText =
      '*Password must be at least 6 characters long';
    isValid = false;
  }

  if (isValid) {
    success.classList.add('active');
    btn.disabled = true;
    form.reset();
  }
});
