import {expect} from 'chai';
import {escape} from 'lodash';
import {task1, task2} from './index';

describe('day14', () => {
  it('task1', () => {
    expect(task1(9)).eq('5158916779');
    expect(task1(5)).eq('0124515891');
    expect(task1(18)).eq('9251071085');
    expect(task1(2018)).eq('5941429882');
  });

  it('task2', () => {
    expect(task2(51589)).eq(9);
    expect(task2('01245')).eq(5);
    expect(task2(92510)).eq(18);
    expect(task2(59414)).eq(2018);
  });
});