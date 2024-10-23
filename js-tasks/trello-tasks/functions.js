// ! 1. Напишіть функцію, яка приймає два числа і повертає їх суму.
const sum = (num1, num2) => {
  return num1 + num2;
}

console.log(sum(2, 5)); // 7
console.log(sum(444, 55)); // 499
console.log(sum(10, 10)); // 20


// ! 2. Напишіть функцію, яка приймає рядок і повертає його в верхньому регістрі.
const upperCase = (string) => {
  return string.toUpperCase();
}

console.log(upperCase('hello, this is a big text'));
console.log(upperCase("finally, i'm big"));
console.log(upperCase('wow, i see everything from here'));


// ! 3. Напишіть функцію, яка приймає масив чисел і повертає новий масив з квадратами цих чисел.
const pow = (numbers) => {
  return numbers.map(number => Math.pow(number, 2));
}

console.log(pow([1, 2, 3, 4, 5])); // [1, 4, 9, 16, 25]





