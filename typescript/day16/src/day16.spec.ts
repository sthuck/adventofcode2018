import {expect} from 'chai';
import {parse, howManyActionsMatch} from './index';

describe('day16', () => {
  it('task1', () => {
    const input = `
Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1`.trim().split('\n');

    const stateChange = parse(input);
    expect(howManyActionsMatch(stateChange[0])).to.eq(3);
  });
});
