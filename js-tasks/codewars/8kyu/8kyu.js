// ! 1. A wolf in sheep's clothing - https://www.codewars.com/kata/5c8bfa44b9d1192e1ebd3d15
function warnTheSheep(queue) {
  queue.reverse();
  const position = queue.indexOf('wolf');
  if (position === 0) {
    return 'Pls go away and stop eating my sheep';
  }
  return `Oi! Sheep number ${position}! You are about to be eaten by a wolf!`;
}

// ! 2. Neutralisation - https://www.codewars.com/kata/65128732b5aff40032a3d8f0
function neutralise(s1, s2) {
  const splitedS1 = s1.split('');
  const splitedS2 = s2.split('');
  let arr = [];
  for (let i = 0; i < s1.length; i++) {
    if (splitedS1[i] !== splitedS2[i]) {
      arr.unshift('0');
    } else {
      arr.unshift(splitedS1[i]);
    }
  }
  const newString = arr.reverse().join('');
  return newString;
}

// ! 3. If you can't sleep, just count sheep! - https://www.codewars.com/kata/5b077ebdaf15be5c7f000077
const countSheep = function (num) {
  let arr = [];
  if (num === 0) {
    return '';
  } else if (num >= 1) {
    for (let i = 1; i <= num; i++) {
      arr.push(`${i} sheep...`);
    }
    const string = arr.join('');
    return string;
  }
};

// ! 4. The Feast of Many Beasts - https://www.codewars.com/kata/5aa736a455f906981800360d
function feast(beast, dish) {
  return (
    beast.charAt(0) === dish.charAt(0) &&
    beast.charAt(beast.length - 1) === dish.charAt(dish.length - 1)
  );
}

// ! 5. Closest elevator - https://www.codewars.com/kata/5c374b346a5d0f77af500a5a
function elevator(left, right, call) {
  if (left > right && left > call) {
    return 'right';
  } else if (left === right) {
    return 'right';
  } else if (left < right && left < call) {
    return 'right';
  } else {
    return 'left';
  }
}

// ! 6. Sum of differences in array - https://www.codewars.com/kata/5b73fe9fb3d9776fbf00009e
function sumOfDifferences(arr) {
  if (arr.length < 2) return 0;
  arr.sort((a, b) => b - a);
  let sum = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    sum += arr[i] - arr[i + 1];
  }
}

// ! 7. Array plus array - https://www.codewars.com/kata/5a2be17aee1aaefe2a000151/solutions/javascript
function arrayPlusArray(arr1, arr2) {
  const newArr = arr1.concat(arr2);
  const sum = newArr.reduce((accumulator, current) => accumulator + current, 0);
  return sum;
}

// ! 8. Invert values - https://www.codewars.com/kata/5899dc03bc95b1bf1b0000ad
function invert(array) {
  return array.map((el) => el * -1);
}

// ! 9. Quarter of the year - https://www.codewars.com/kata/5ce9c1000bab0b001134f5af
const quarterOf = (month) => {
  return month <= 3 ? 1 : month <= 6 ? 2 : month <= 9 ? 3 : 4;
};

// ! 10. Merge two sorted arrays into one - https://www.codewars.com/kata/5899642f6e1b25935d000161
function mergeArrays(arr1, arr2) {
  const arr3 = [...arr1, ...arr2];
  const uniqueArr = [...new Set(arr3)];
  uniqueArr.sort((a, b) => a - b);
  return uniqueArr;
}

// ! 11. Fun with ES6 Classes #1 - People, people, people - https://www.codewars.com/kata/56f7f8215d7c12c0e7000b19
class Person {
  constructor(firstName = 'John', lastName = 'Doe', age = 0, gender = 'Male') {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.gender = gender;
  }

  sayFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  static greetExtraTerrestrials(raceName) {
    return `Welcome to Planet Earth ${raceName}`;
  }
}

// ! 12. Duck Duck Goose - https://www.codewars.com/kata/582e0e592029ea10530009ce
const duckDuckGoose = (players, goose) => {
  const player = (goose - 1) % players.length;
  return players[player].name;
};

// ! 13. Beginner - Lost Without a Map - https://www.codewars.com/kata/57f781872e3d8ca2a000007e
const maps = (x) => {
  return x.map((item) => item * 2);
};

// ! 14. Beginner - Reduce but Grow - https://www.codewars.com/kata/57f780909f7e8e3183000078
const grow = (x) => {
  return x.reduce((acc, curr) => {
    return (acc *= curr);
  }, 1);
};

// ! 15. To square(root) or not to square(root) - To square(root) or not to square(root)
const squareOrSquareRoot = (array) => {
  return array.map((item) => {
    let sqrt = Math.sqrt(item);
    if (Number.isInteger(sqrt)) {
      return sqrt;
    }
    return item * item;
  });
};

// ! 16. I love you, a little , a lot, passionately ... not at all - https://www.codewars.com/kata/57f24e6a18e9fad8eb000296
const howMuchILoveYou = (nbPetals) => {
  let phrases = [
    'I love you',
    'a little',
    'a lot',
    'passionately',
    'madly',
    'not at all',
  ];
  const index = (nbPetals - 1) % phrases.length;
  return phrases[index];
};

// ! 17. Well of Ideas - Easy Version - https://www.codewars.com/kata/57f222ce69e09c3630000212
const well = (x) => {
  let goodIdeas = 0;
  x.forEach((idea) => {
    if (idea === 'good') {
      goodIdeas++;
    }
  });

  if (goodIdeas === 0) {
    return 'Fail!';
  } else if (goodIdeas > 0 && goodIdeas <= 2) {
    return 'Publish!';
  } else if (goodIdeas > 2) {
    return 'I smell a series!';
  }
};

// ! 18. Sum Mixed Array - https://www.codewars.com/kata/57eaeb9578748ff92a000009
const sumMix = (x) => {
  let numbers = x.map((item) => Number(item));
  return numbers.reduce((acc, curr) => acc + curr, 0);
};

// ! 19. Fake Binary - https://www.codewars.com/kata/57eae65a4321032ce000002d
const fakeBin = (x) => {
  const arr = x.split('').map((item) => {
    if (item < 5) {
      return (item = '0');
    }
    if (item >= 5) {
      return (item = '1');
    }
  });
  return arr.join('');
};

// ! 20. Convert a string to an array - https://www.codewars.com/kata/57e76bc428d6fbc2d500036d
const stringToArray = (string) => string.split(' ');

// ! 21. Is there a vowel in there? - https://www.codewars.com/kata/57cff961eca260b71900008f
const isVow = (a) => {
  const vowelCodes = { 97: 'a', 101: 'e', 105: 'i', 111: 'o', 117: 'u' };
  const newArr = a.map((item) => {
    if (vowelCodes[item]) {
      return vowelCodes[item];
    }
    return item;
  });

  return newArr;
};

// ! 22. Sort and Star - https://www.codewars.com/kata/57cfdf34902f6ba3d300001e
const twoSort = (s) => s.sort()[0].split('').join('***');

// ! 23. You only need one - Beginner - https://www.codewars.com/kata/57cc975ed542d3148f00015b
const check = (a, x) => a.includes(x);

// ! 24. No Loops 1 - Small enough? - https://www.codewars.com/kata/no-loops-1-small-enough
const smallEnough = (a, limit) => a.every((item) => item <= limit);

// ! 25. Remove duplicates from list - https://www.codewars.com/kata/57a5b0dfcf1fa526bb000118
const distinct = (a) => [...new Set(a)];

// ! 26. Calculate average - https://www.codewars.com/kata/57a2013acf1fa5bfc4000921
const findAverage = (array) => {
  let sum = 0;
  if (array.length === 0) {
    return 0;
  }
  array.forEach((item) => (sum += item));
  return sum / array.length;
};

// ! 27. Sum of positive - https://www.codewars.com/kata/5715eaedb436cf5606000381
const positiveSum = (arr) =>
  arr.filter((item) => item > 0).reduce((acc, curr) => acc + curr, 0);

// ! 28. Count of positives / sum of negatives - https://www.codewars.com/kata/576bb71bbbcf0951d5000044
const countPositivesSumNegatives = (input) => {
  if (!input || input.length === 0) {
    return [];
  }
  const countPositive = input.filter((item) => item > 0).length;
  const sumNegative = input
    .filter((item) => item < 0)
    .reduce((acc, curr) => acc + curr, 0);
  return [countPositive, sumNegative];
};

// ! 29. Removing Elements - https://www.codewars.com/kata/5769b3802ae6f8e4890009d2
const removeEveryOther = (arr) =>
  arr.filter((item, index) => (index + 1) % 2 !== 0);

// ! 30. Arguments to Binary addition - https://www.codewars.com/kata/57642a90dee2da8dd3000161
const arr2bin = (arr) =>
  arr
    .filter((item) => typeof item === 'number')
    .reduce((acc, curr) => acc + curr, 0)
    .toString(2);

// ! 31. UEFA EURO 2016 - https://www.codewars.com/kata/57613fb1033d766171000d60
const uefaEuro2016 = (teams, scores) =>
  scores[0] > scores[1]
    ? `At match ${teams[0]} - ${teams[1]}, ${teams[0]} won!`
    : scores[0] < scores[1]
    ? `At match ${teams[0]} - ${teams[1]}, ${teams[1]} won!`
      : `At match ${teams[0]} - ${teams[1]}, teams played draw.`; 
    
// ! 32. Merging sorted integer arrays (without duplicates) - https://www.codewars.com/kata/573f5c61e7752709df0005d2
const mergeArrays = (a, b) => {
  const newArr = [...a, ...b].sort((a, b) => a - b);
  return [...new Set(newArr)];
};

// ! 33. Define a card suit - https://www.codewars.com/kata/5a360620f28b82a711000047
const defineSuit = (card) =>
  card.includes('♣')
    ? card.replace(card, 'clubs')
    : card.includes('♦')
    ? card.replace(card, 'diamonds')
    : card.includes('♥')
    ? card.replace(card, 'hearts')
        : card.replace(card, 'spades');
    
// ! 34. Multiplication table for number - https://www.codewars.com/kata/5a2fd38b55519ed98f0000ce
const multiTable = (number) => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return arr
    .map((item) =>
      item === 10
        ? `${item} * ${number} = ${item * number}`
        : `${item} * ${number} = ${item * number}\n`
    )
    .join('');
};

// ! 35. Contamination #1 -String- - https://www.codewars.com/kata/596fba44963025c878000039
const contamination = (text, char) =>
  text.length === 0
    ? ''
    : text
        .split('')
        .map((letter) => letter.replace(letter, char))
        .join('');

// ! 36. Capitalization and Mutability - https://www.codewars.com/kata/595970246c9b8fa0a8000086
const capitalizeWord = (word) =>
  word.replace(word.charAt(0), word.charAt(0).toUpperCase());

// ! 37. Who is going to pay for the wall? - https://www.codewars.com/kata/58bf9bd943fadb2a980000a7
const whoIsPaying = (name) =>
  name.length > 2 ? [name, name.slice(0, 2)] : [name];

// ! 38. All Star Code Challenge #18 - https://www.codewars.com/kata/5865918c6b569962950002a1
const strCount = (str, letter) =>
  str.length === 0 ? 0 : str.split('').filter((char) => char === letter).length;

// ! 39. ES6 string addition - https://www.codewars.com/kata/582e4c3406e37fcc770001ad
const joinStrings = (string1, string2) => `${string1} ${string2}`;

// ! 40. Exclamation marks series #1: Remove an exclamation mark from the end of string - https://www.codewars.com/kata/57fae964d80daa229d000126
const remove = (string) =>
  string.endsWith('!') ? string.slice(0, string.length - 1) : string;

// ! 41. Simple Comparison? - https://www.codewars.com/kata/57f6ecdfcca6e045d2001207
const add = (a, b) => a == b;





