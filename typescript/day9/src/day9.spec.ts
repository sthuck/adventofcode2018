import {expect} from 'chai';
import {CyclicArray, game} from './index';

describe('day9', () => {
  it('cyclicArray', () => {
    const arr = new CyclicArray<number>();
    arr.push(0);
    let index = 0;
    let i = 1;

    index = arr.pushAt(index + 1, i++);

    expect(index).to.eq(1);
    expect(arr.toString()).to.eq('0,1')

    index = arr.pushAt(index + 1, i++);

    expect(index).to.eq(1);
    expect(arr.toString()).to.eq('0,2,1')

    index = arr.pushAt(index + 1, i++);

    expect(index).to.eq(3);
    expect(arr.toString()).to.eq('0,2,1,3')


  });

  it('game', () => {
    expect(game(9, 25, true)).to.eq(32);
    // expect(game(10, 1618)).to.eq(8317);
    expect(game(13, 7999)).to.eq(146373);
    // expect(game(17, 1104)).to.eq(2764);
    // expect(game(21, 6111)).to.eq(54718);
    // expect(game(30, 5807)).to.eq(37305);
    expect(game(471, 72026)).to.eq(37305);
  });
});