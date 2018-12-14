import {expect} from 'chai';
import {computePowerLevel, buildGrid, findBestSquare} from './index';

describe('day11', () => {
  it('computePowerLevel', () => {
    // Fuel cell at  122, 79, grid serial number 57: power level - 5.
    // Fuel cell at 217, 196, grid serial number 39: power level  0.
    // Fuel cell at 101, 153, grid serial number 71: power level  4.
    expect(computePowerLevel(122, 79, 57)).to.eq(-5);
    expect(computePowerLevel(217, 196, 39)).to.eq(0);
    expect(computePowerLevel(101, 153, 71)).to.eq(4);
  });

  it('findBestSquar', () => {
    const grid = buildGrid(300, 18);
    expect(findBestSquare(grid)).to.deep.eq({x: 32, y: 44, power: 29});
  });
});