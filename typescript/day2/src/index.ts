/** Horrible code today, gave up at some point */

const strToArr = (input: string) => input.split('');
import {groupBy, mapValues} from 'lodash';

type LetterCount = Array<{letter: string, count: number}>;

export const countChars = (input: string): LetterCount => {
  const charArr = strToArr(input);
  const byCharCountMap = charArr.reduce((map, char) => {
    map[char] = map[char] ? map[char] + 1 : 1;
    return map;
  }, {} as Record<string, number>);
  const letterCounts = [...Object.entries(byCharCountMap)].map(([key, value]) => ({letter: key, count: value}));
  return letterCounts;
}
export const uniqueCount = (input: string) => {
  const letterCount = countChars(input);
  const map = groupBy(letterCount, ({count}) => count);
  const byCountLetterMap = mapValues(map, (lc: LetterCount) =>  lc.map(({letter}) => letter));
  return mapValues(byCountLetterMap, letterArray => letterArray.length ? 1 : 0);
}

export const doChecksum = (input: string[]) => {
  const perLineUniqeCount = input.map(line => uniqueCount(line));
  const twoThreeCounts = perLineUniqeCount.reduce((sum, lineCount) => {
    lineCount[2] ? sum[2]++ : null;
    lineCount[3] ? sum[3]++ : null;
    return sum;
  }, {2: 0, 3: 0} as Record<2 | 3, number>);
  return twoThreeCounts[2]* twoThreeCounts[3];
}

export const wordDistance = (word1: string, word2: string) => {
  const diffPos: number[] = [];
  let index = 0;
  let length = word1.length;
  while (index < length && diffPos.length < 2) {
    if (word1[index] !== word2[index]) {
      diffPos.push(index);
    }
    index++; 
  }
  return diffPos;
}

export const findSimilarWords = (input: string[]) => {
  let foundWords: string[] | null = null;
  let diff: number[] = [];
  for (let i = 0; i < input.length && !foundWords; i++) {
    for (let j = i+1; j < input.length && !foundWords; j++) {
      diff = wordDistance(input[i], input[j]);
      if (diff.length < 2) {
        foundWords = [input[i], input[j]];
      }
    }
  }
  return {foundWords, diff};
}

export const findSimilarChars = (input: string[]) => {
  const {foundWords, diff} = findSimilarWords(input);
  if (foundWords && foundWords.length) {
    return (foundWords[0].slice(0, diff[0]) + foundWords[0].slice(diff[0]+1, foundWords[0].length));
  }
  return null;
};