import {expect} from 'chai';
import {parse, computeTask1, computeTask2} from './index';

describe('day6', () => {
  it('', () => {
    const lines = `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`.split('\n');
    const points = parse(lines);
    const max = computeTask1(points);
    expect(max).to.deep.equal(['E', 17])
  });
  
  it('task2', () => {
    const lines = `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`.split('\n');
    const points = parse(lines);
    const regionSize = computeTask2(points, 32);
    expect(regionSize).to.deep.equal(16)
  });
});