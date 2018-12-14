import {range, uniqueId, max} from 'lodash';

const hashPoint = ({x, y}: {x: number, y: number}) => `<${x}, ${y}>`
const sum = <T>(arr: Array<T>, how: (t: T) => number = (item: T) => (item as any)) => arr.reduce((sum, item) => sum + how(item), 0);

export const buildGrid = (gridSize: number, serialNumber: number) => {
  const grid = range(gridSize).map(y => range(gridSize).map(x => ({x: x + 1, y: y + 1})));
  return grid.map(row => row.map(({x, y}) => {
    return computePowerLevel(x, y, serialNumber);
  }));
}

type Grid = ReturnType<typeof buildGrid>;

export const findBestSquare = (grid: Grid, squareSize = 3) => {
  let biggestPowerLevel = {x: 0, y: 0, power: -Infinity};
  grid.forEach((row, y) => row.forEach((powerLevel, x) => {
    const sumOfPowerLevel = sum(range(squareSize), yOffset => sum(range(squareSize), xOffset => grid[y + yOffset] ? grid[y + yOffset][x + xOffset] : 0));
    if (sumOfPowerLevel > biggestPowerLevel.power) {
      biggestPowerLevel = {x, y, power: sumOfPowerLevel}
    }
  }));
  return biggestPowerLevel;
}

export const findBestSquareWithSize = (grid: Grid) => {
  let biggestPowerLevel = {x: 0, y: 0, squareSize: 0, power: -Infinity};
  const gridSize = grid.length;
  grid.forEach((row, y) => row.forEach((_, x) => {
    const maxSqareSize = Math.min(gridSize - y, gridSize - x);
    let power = 0;
    range(maxSqareSize).forEach(squareSize => {
      power += grid[y+squareSize][x + squareSize];
      power += sum(range(squareSize), xOffset => grid[y + squareSize][x+xOffset]);
      power += sum(range(squareSize), yOffset => grid[y + yOffset][x+squareSize]);
      if (power > biggestPowerLevel.power) {
        biggestPowerLevel = {x: x+1, y: y+1, squareSize: squareSize + 1, power};
      }
    });
  }));
  return biggestPowerLevel;
}

export const computePowerLevel = (x: number, y: number, serialNumber: number) => {
  const rackId = x + 10;
  let powerLevel = (y * rackId);
  powerLevel += serialNumber;
  powerLevel = powerLevel * rackId;
  powerLevel = Math.floor((powerLevel / 100)) % 10;
  powerLevel -= 5;
  return powerLevel;
}