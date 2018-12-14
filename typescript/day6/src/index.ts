import {max, range, maxBy, sortBy} from 'lodash';
import {stringify} from 'querystring';

interface Point {
  x: number;
  y: number;
  id: string;
}

export const parse = (input: string[]): Point[] => {
  return input.map((line, index) => {
    const match = /(\d+), (\d+)/.exec(line)!;
    const [, x, y] = match;
    return {x: parseInt(x, 10), y: parseInt(y, 10), id: String.fromCharCode(65 + index)};
  })
}

const distance = (p1: Point, p2: {x: number, y: number}) => {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

const getGridSize = (input: Point[]) => {
  const xs = input.map(({x, y}) => x);
  const ys = input.map(({x, y}) => y);
  const maxX = max(xs);
  const maxY = max(ys);
  return [maxX!, maxY!];
}

const isPointOnEdge = (point: {x: number, y: number}, gridSize: [number, number]) => {
  const [maxX, maxY] = gridSize;
  return point.x === 0 || point.y === 0 || point.x === maxX || point.y === maxY;
}

export const computeTask1 = (input: Point[]) => {
  const [maxX, maxY] = getGridSize(input);
  const grid = range(maxY + 1).map(() => range(maxX + 1).map(() => ''));
  grid.forEach((row, y) => row.forEach((_, x) => {
    const distances = input.map(point => ({distance: distance(point, {x, y}), id: point.id}));
    const sorted = sortBy(distances, 'distance');
    const closest = sorted[0].distance === sorted[1].distance ? '.' : sorted[0].id;
    row[x] = closest;
  }));

  const countMap = new Map<string, number>();
  input.forEach(p => countMap.set(p.id, 0));
  grid.forEach((row, y) => row.forEach((closest, x) => {
    if (closest === '.') {
      return;
    }
    const current = countMap.get(closest);
    if (current === Infinity) {
      return;
    }
    if (isPointOnEdge({x, y}, [maxX, maxY])) {
      countMap.set(closest, Infinity);
      return;
    }
    countMap.set(closest, current! + 1);
  }));
  const final = ([...countMap.entries()].filter(([id, numberOfPoints]) => numberOfPoints !== Infinity));
  return maxBy(final, ([id, numberOfPoints]) => numberOfPoints);
}

export const computeTask2 = (input: Point[], maxSize: number) => {
  const [maxX, maxY] = getGridSize(input);
  const grid = range(maxY + 1).map(() => range(maxX + 1).map(() => 0));
  let allPointsLessThanMaxSize = 0;
  grid.forEach((row, y) => row.forEach((_, x) => {
    const distanceToAllPoints = input.reduce((sum, point) => sum + distance(point, {x, y}), 0);
    row[x] = distanceToAllPoints;
    if (distanceToAllPoints < maxSize) {
      allPointsLessThanMaxSize++;
    }
  }));
  return allPointsLessThanMaxSize;
}