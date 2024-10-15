// ! 1. Створіть проміс, який резолвиться через 2 секунди з повідомленням "Promise resolved!".
// ! 2. Використовуйте then для виведення повідомлення, коли проміс буде резолвлено.
// ! 3. Створіть проміс, який відхиляється з помилкою "Promise rejected!" та обробіть цю помилку за допомогою catch.

// ? Option 1 - Promise constructor
const timeout = () => {
  return new Promise((resolve, reject) => {
    const promise = true;
    setTimeout(() => {
      if (promise) {
        resolve('Promise resolved!(1)');
      }
      reject('Promise rejected!(1)');
    }, 2000);
  });
};

timeout()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));



// ? Option 2 - async & await
const timeout1 = async (millisec) => {
  return new Promise((resolve, reject) => {
    const promise = true;
    setTimeout(() => {
      if (promise) {
        resolve('Promise resolved!(2)');
      }
      reject('Promise rejected!(2)');
    }, millisec);
  });
};

const promise = async () => {
  try {
    const res = await timeout1(2000);
    console.log(res);
  } catch (error) {
    console.error(error);
  }
};

promise();
