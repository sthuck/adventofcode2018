import {expect} from 'chai';
import {toNodes, parse, sumMetadata, specialSum} from './index';

describe('day8', () => {
  it('parse', () => {
    const input = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2';
    const numbers = parse(input);
    const {node} = toNodes(numbers, 0);
    expect(node.childrenN).to.eql(2);
    expect(node.children[1].childrenN).to.eql(1);
  });

  it('task1', () => {
    const input = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2';
    const numbers = parse(input);
    const {node} = toNodes(numbers, 0);
    const sum = sumMetadata(node);
    expect(sum).to.eq(138);
  });

  it('task2', () => {
    const input = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2';
    const numbers = parse(input);
    const {node} = toNodes(numbers, 0);
    const sum = specialSum(node);
    expect(sum).to.eq(66);
  });
});