// ! 1. Створіть асинхронну функцію, яка повертає "Hello, World!" через 1 секунду.
// ! 2. Викличте цю функцію і виведіть результат в консоль.
// ! 3. Використовуйте try/catch для обробки помилки в асинхронній функції, яка кидає помилку.

const timeout = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Hello World!');
    }, 1000);
  });
};

const runCode = async () => {
  try {
    const res = await timeout();
    console.log(res);
  } catch (error) {
    console.error(error);
  }
};

runCode();
