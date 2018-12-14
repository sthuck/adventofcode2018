import {expect} from 'chai';
import {applyFrequencies, parseLine, findDuplicateFreq} from './index';

describe('task1', () => {

  describe('parsing', () => {
    it('parse plus', () => {
      expect(parseLine('+3')).to.eq(3);
    });
    it('parse minus', () => {
      expect(parseLine('-3')).to.eq(-3);
    });
  });


  it('apply input, task1', () => {
    const input = ['+1', '-2', '+3', '+1'];
    expect(applyFrequencies(0, input)).to.eq(3);
  });



  it('task2', () => {
    const testcasesS = `+1, -1 first reaches 0 twice.
+3, +3, +4, -2, -4 first reaches 10 twice.
-6, +3, +8, +5, -6 first reaches 5 twice.
+7, +7, -2, -7, -4 first reaches 14 twice.`;
    const testcases = testcasesS.split('\n').map(testcase => {
      const match = testcase.match(/([\d\+\-, ]+)first reaches (\d+) twice./);
      return {input: match![1].split(','), expected: parseInt(match![2], 10)};
    });
    testcases.forEach(({input, expected}) => {
      expect(findDuplicateFreq(0, input)).to.eq(expected);
    });
  });
});