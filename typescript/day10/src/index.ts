import {range, uniqueId, max, min, inRange} from 'lodash';

interface Point {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}
const sum = <T>(arr: Array<T>, how: (t: T) => number = (item: T) => (item as any)) => arr.reduce((sum, item) => sum + how(item), 0);
export const parse = (line: string) => {
  const [x, y, velocityX, velocityY] = line.replace(/[^\d \-]/g, '').split(/\s/).filter(s => !!s).map(s => parseInt(s, 10));
  return {x, y, velocityX, velocityY};
}

export const updatePoint = (p: Point) => {
  p.x += p.velocityX;
  p.y += p.velocityY;
}

const getAllNeighbors = (p: {x: number, y: number}) => {
  const {x, y} = p;
  return [{x, y: y + 1}, {x, y: y - 1}, {x: x + 1, y}, {x: x - 1, y}]
}

const pointStr = (point: {x: number, y: number}) => `<${point.x}, ${point.y}>`;

const howManyPointsAdjcent = (points: Point[]) => {
  const map = new Map<string, Point>();
  points.forEach(point => map.set(pointStr(point), point));
  return sum(points, point => sum(getAllNeighbors(point), neighbor => map.has(pointStr(neighbor)) ? 1 : 0))
}



export const findBestIteration = (points: Point[], stopAt = 20000) => {
  const howManyPointsAdjcentPerIteration = range(stopAt).map(iteration => {
    const result = howManyPointsAdjcent(points);
    points.forEach(updatePoint);
    return result;
  });
  return howManyPointsAdjcentPerIteration.reduce((maxIndex, item, index, arr) => item > arr[maxIndex] ? index : maxIndex)
}


/** not good */
const converXYToZeroBased = (p: {x: number, y: number}, width: number, heihgt: number) => {
  const {x, y} = p;
  return {x: x + width / 2, y: y + heihgt / 2}
}

export const createConsoleCanvas = (points: Point[]) => {
  debugger;
  const maxX = max(points.map(p => p.x))!;
  const minX = min(points.map(p => p.x))!;
  const maxY = max(points.map(p => p.y))!;
  const minY = min(points.map(p => p.y))!;

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  const consoleCanvas = range(height).map(() => range(width).map(() => ' '));
  points.forEach(point => {
    const [x, y] = [point.x - minX, point.y - minY]
    consoleCanvas[y][x] = '*';
  });
  return consoleCanvas;
}

export const drawConsoleCanvas = (canvas: string[][]) => {
  console.log(canvas.map(row => row.join('')).join('\n'));
}
export const resetScreen = function () {
  return process.stdout.write('\x1Bc');
}