import {expect} from 'chai';
import {parse, task1, task2} from './index';

const input = `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`.split('\n');

describe('day7', () => {

  it('', () => {
    const stepMap = parse(input);
    expect(task1(stepMap)).to.eq('CABDFE');
  });

  it('', () => {
    const stepMap = parse(input);
    expect(task2(stepMap, 0, 2)).to.eq(15);
  });
});