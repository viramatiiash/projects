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


