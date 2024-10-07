// ! 1. A wolf in sheep's clothing - https://www.codewars.com/kata/5c8bfa44b9d1192e1ebd3d15
function warnTheSheep(queue) {
  queue.reverse();
  const position = queue.indexOf('wolf');
  if (position === 0) {
    return 'Pls go away and stop eating my sheep';
  }
  return `Oi! Sheep number ${position}! You are about to be eaten by a wolf!`;
}
