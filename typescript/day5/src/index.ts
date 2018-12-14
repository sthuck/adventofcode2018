import {range, min} from 'lodash';

const CAPITAL_DIFF = 32;

const doSingleReaction = (polymer: number[]) => {
  let index = 0;
  const length = polymer.length;
  const newPolymer: number[] = []
  while (index < length) {
    if (Math.abs(polymer[index]-polymer[index+1]) === CAPITAL_DIFF) {
      index = index + 2;
    } else {
      newPolymer.push(polymer[index]);
      index ++;
    }
  }
  return newPolymer;
}

export const doReaction = (polymer: string) => {
  let polymerByNumber = polymer.split('').map(c => c.charCodeAt(0));
  let currentLength = polymerByNumber.length;
  let oldLength = -1;
  while (oldLength !== currentLength) {
    polymerByNumber = doSingleReaction(polymerByNumber);
    oldLength = currentLength;
    currentLength = polymerByNumber.length;
  }
  return String.fromCharCode(...polymerByNumber);
}

const letters = range('a'.charCodeAt(0), 'z'.charCodeAt(0)).map(n => String.fromCharCode(n));

export const findBest = (polymer: string) => {
  const polymerLengths = letters.map(letter => {
    const removedPolymer = polymer.replace(new RegExp(`[${letter}${letter.toUpperCase()}]`, 'g'), '');
    return doReaction(removedPolymer).length;
  });
  return min(polymerLengths);
}