// ! 1. Playing with Sets : Sup/Sub - https://www.codewars.com/kata/5885424265fc9c38100017ef
// 1st variant
function isSubsetOf(s1, s2) {
  const hasAllValues = [...s1].every((value) => s2.has(value));
  if (hasAllValues && s1.size <= s2.size) {
    return true;
  } else if (s2.size === 0) {
    return false;
  }
  return false;
}

function isSupersetOf(s1, s2) {
  const hasAllValues = [...s2].every((value) => s1.has(value));
  if (hasAllValues && s1.size >= s2.size) {
    return true;
  } else if (s1.size === 0) {
    return false;
  }
  return false;
}

// 2nd variant
function isSubsetOf(s1, s2) {
  return [...s1].every((el) => s2.has(el));
}

function isSupersetOf(s1, s2) {
  return isSubsetOf(s2, s1);
}

// ! 2. Playing with Sets : Complement - https://www.codewars.com/kata/5884e9ccf72916207900010f
function diff(s1, s2) {
  return new Set([...s1].filter((value) => !s2.has(value)));
}

// ! 3. Playing with Sets : Symmetric difference - https://www.codewars.com/kata/5884f4727987a2a561000147
function symDiff(s1, s2) {
  let hasNoValue1 = [...s1].filter((value) => !s2.has(value));
  let hasNoValue2 = [...s2].filter((value) => !s1.has(value));
  let newArr = [...hasNoValue1, ...hasNoValue2];
  return new Set(newArr);
}

// ! 4. Playing with Sets : Intersection - https://www.codewars.com/kata/5884d46015a70f6cd7000035
function inter(s1, s2) {
  return new Set([...s1].filter((value) => s2.has(value)));
}

// ! 5. Playing with Sets : Union - https://www.codewars.com/kata/5884ce61f36b6d738b000053
function union(s1, s2) {
  return new Set([...s1, ...s2]);
}

// ! 6. All Star Code Challenge #2 - https://www.codewars.com/kata/5864001db3a675d9a7000091
const findAverage1 = (allStars) => {
  let sum = 0;
  sum = allStars.reduce((acc, curr) => acc + curr, 0);
  return sum / allStars.length;
};

// ! 7. All Star Code Challenge #3 - https://www.codewars.com/kata/58640340b3a675d9a70000b9
const removeVowels = (str) => {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  return str
    .split('')
    .filter((letter) => !vowels.includes(letter))
    .join('');
};

// ! 8. All unique - https://www.codewars.com/kata/553e8b195b853c6db4000048
const hasUniqueChars = (str) => {
  const strArr = str.split('');
  const strSet = new Set(strArr);
  return strArr.length === strSet.size;
};

// ! 9. Unlucky Days - https://www.codewars.com/kata/56eb0be52caf798c630013c0
const unluckyDays = (year) => {
  let count = 0;

  for (let month = 0; month < 12; month++) {
    const date = new Date(year, month, 13);

    if (date.getDay() === 5) {
      count++;
    }
  }
  return count;
};

// ! 10. Leap Years - https://www.codewars.com/kata/526c7363236867513f0005ca
const isLeapYear = (year) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

