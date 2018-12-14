import {expect} from 'chai';
import {countChars, uniqueCount, doChecksum, findSimilarChars} from './index';

describe('task1', () => {
  it('countUniqeChars', () => {
    const map = countChars('abbcddd');
    expect(map).to.deep.equal([
      {letter: 'a', count: 1},
      {letter: 'b', count: 2},
      {letter: 'c', count: 1},
      {letter: 'd', count: 3},
    ]);
  });

  it('uniqeCount', () => {
    const cases: [string, any][] = [
      ['abcdef', {1: 1}],
      ['bababc', {2: 1, 3: 1}],
      ['abbcde', {2: 1}],
      ['abcccd', {3: 1}],
      ['aabcdd', {2: 1}],
      ['abcdee', {2: 1}],
      ['ababab', {3: 1}],
    ];
    cases.forEach(([testCase, expected]) => {
      expect(uniqueCount(testCase), testCase).to.contain(expected);
    });
  });
  it('task1', () => {
    const input = ['abcdef',
      'bababc',
      'abbcde',
      'abcccd',
      'aabcdd',
      'abcdee',
      'ababab',
    ];
    expect(doChecksum(input)).to.eq(12);
  });

});

describe('task2', () => {
  it('', () => {
    const input = `abcde
fghij
klmno
pqrst
fguij
axcye
wvxyz`.split('\n')
    const result = findSimilarChars(input);
    expect(result).to.eq('fgij');
  });
});