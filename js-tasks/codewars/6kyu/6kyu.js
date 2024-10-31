// ! 1. What century is it? - https://www.codewars.com/kata/52fb87703c1351ebd200081f
const whatCentury = (year) => {
  const century = Math.ceil(Number(year) / 100)
    .toString()
    .slice(0, 2);
  if (
    century.includes('11') ||
    century.includes('12') ||
    century.includes('13')
  ) {
    return `${century}th`;
  } else if (century.endsWith('1')) {
    return `${century}st`;
  } else if (century.endsWith('2')) {
    return `${century}nd`;
  } else if (century.endsWith('3')) {
    return `${century}rd`;
  } else {
    return `${century}th`;
  }
};