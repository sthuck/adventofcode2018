import {max, min, range, isEmpty, inRange} from 'lodash';
import * as assert from 'assert';
import {writeFileSync} from 'fs';
interface LineAssignment {
  xrange: {from: number, to: number};
  yrange: {from: number, to: number};
}

function inclusiveRange(start: number, end?: number) {
  return end === undefined ? range(start + 1) : range(start, end + 1);
}
export const getWhile = (variable: number, increment: (t: number) => number, condition: (t: number) => boolean, inclusive = true) => {
  let prevVariable: undefined | number;
  while (condition(variable)) {
    prevVariable = variable;
    variable = increment(variable);
  }
  return inclusive ? prevVariable : variable;
}

export const findFirst = (variable: number, increment: (t: number) => number, condition: (t: number) => boolean) => {
  return getWhile(variable, increment, condition, false);
}

const hashPoint = (p: Point) => `<${p.x}, ${p.y}>`;


export const parseLine = (line: string): LineAssignment => {
  const yregex = /.*y=([\d\.]+).*/;
  const xregex = /.*x=([\d\.]+).*/;
  const rangeReegex = /(\d*)\.\.(\d*)/;
  const [xrange, yrange] = [xregex, yregex].map(regex => {
    const value = regex.exec(line)![1];
    if (rangeReegex.test(value)) {
      const [, fromN, toN] = rangeReegex.exec(value)!;
      return {from: parseInt(fromN, 10), to: parseInt(toN, 10)};
    } else {
      return {from: parseInt(value, 10), to: parseInt(value, 10)};
    }
  });
  return {xrange, yrange};
};

enum TileType {
  EMPTY = '.',
  CLAY = '#',
  WATER = '~',
  WETSAND = '|',
}

const blockingTiles = [TileType.WATER, TileType.CLAY];
const isTileBlocking = (tile: TileType) => blockingTiles.includes(tile);

export type Board = TileType[][];
export const createBoard = (assignments: LineAssignment[]) => {
  const lowestY = min(assignments.map(({yrange}) => yrange.from))!;
  const highestY = max(assignments.map(({yrange}) => yrange.to))!;
  const lowestX = min(assignments.map(({xrange}) => xrange.from))!;
  const highestX = max(assignments.map(({xrange}) => xrange.to))!;
  const board: Board = inclusiveRange(highestY).map(() => new Array<TileType>(highestX + 2).fill(TileType.EMPTY)); // +2 : +1 becuase range is non inclusive, +1 to count water overflow
  assignments.forEach(({xrange, yrange}) =>
    inclusiveRange(yrange.from, yrange.to)
      .forEach(y => inclusiveRange(xrange.from, xrange.to)
        .forEach(x => board[y][x] = TileType.CLAY)
      )
  )
  return {board, lowestX, highestX, lowestY, highestY};
}
interface Point {
  x: number;
  y: number;
}

/** @returns last row not blocked */
export const spillDown = (board: Board, spilingPoint: Point) => {
  let {x, y} = spilingPoint;
  while (true) {
    board[y][x] = TileType.WETSAND;
    if (!board[y + 1]) {
      return undefined;
    }
    if (isTileBlocking(board[y + 1][x])) {
      const bottomTile = {x, y};
      return bottomTile;
    }
    y++;
  }
}
export const findFillWidth = (board: Board, point: Point) => {
  const {x, y} = point;
  const from = getWhile(x, x => --x, x => board[y][x] && board[y][x] !== TileType.CLAY);
  const to = getWhile(x, x => ++x, x => board[y][x] && board[y][x] !== TileType.CLAY);
  if (from && to) {
    const isBlockedBelow = inclusiveRange(from, to).map(x => board[y + 1][x]).every(tile => isTileBlocking(tile));
    return isBlockedBelow ? {from, to} : undefined;
  }
}
export const fillRowWithWater = (board: Board, y: number, {from, to}: {from: number, to: number}) => {
  inclusiveRange(from, to).forEach(x => board[y][x] = TileType.WATER);
}

export const fillUp = (board: Board, startingPoint: Point) => {
  let width, point = startingPoint;

  while (point.y >= 0 && (width = findFillWidth(board, point))) {
    fillRowWithWater(board, point.y, width);
    point = {...point, y: point.y - 1};
  }
  return point.y >= 0 && point;
}
const isDefined = <T>(obj: T | undefined): obj is T => obj !== undefined;

export const overflowWater = (board: Board, {x, y}: Point): Point[] => {
  const untilClayRight = getWhile(x, x => x + 1, x => board[y][x] && board[y][x] !== TileType.CLAY);
  const untilClayLeft = getWhile(x, x => x - 1, x => board[y][x] && board[y][x] !== TileType.CLAY);
  const rightEndOverflow = findFirst(x, x => x + 1, x => board[y + 1][x] && isTileBlocking(board[y + 1][x]));
  const leftEndOverflow = findFirst(x, x => x - 1, x => board[y + 1][x] && isTileBlocking(board[y + 1][x]));

  const rightEnd = Math.min(...[untilClayRight, rightEndOverflow].filter(isDefined));
  const leftEnd = Math.max(...[untilClayLeft, leftEndOverflow].filter(isDefined));
  assert(leftEnd !== -Infinity && rightEnd !== Infinity);

  inclusiveRange(leftEnd!, rightEnd!).forEach(x => board[y][x] = TileType.WETSAND);

  const canFlowBelowLeft = leftEnd === leftEndOverflow;
  const canFlowBelowRight = rightEnd === rightEndOverflow;

  return [canFlowBelowLeft ? leftEndOverflow : undefined, canFlowBelowRight ? rightEndOverflow : undefined]
    .filter(isDefined)
    .map(x => ({x, y}));
}


export const simulateSpill = (board: Board) => {
  const spilingPoints = [{y: 0, x: 500}];
  const spilingPointsSet = new Set(spilingPoints.map(hashPoint));

  while (!isEmpty(spilingPoints)) {
    const spilingPoint = spilingPoints.shift()!;
    const bottomTile = spillDown(board, spilingPoint);
    if (bottomTile) {
      const topTile = fillUp(board, bottomTile);
      if (topTile) {
        const points = overflowWater(board, topTile);
        points.filter(point => !spilingPointsSet.has(hashPoint(point))).forEach(point => {
          spilingPointsSet.add(hashPoint(point));
          spilingPoints.push(point);
        })
      }
    }
  }
}

const wetTiles = [TileType.WATER, TileType.WETSAND];
const sum = <T>(arr: Array<T>, how: (t: T) => number = (item: T) => (item as any)) => arr.reduce((sum, item) => sum + how(item), 0)

export const task1AndTask2 = (input: string[]) => {
  const lines = input.map(parseLine);
  const {board, highestX, highestY, lowestX, lowestY} = createBoard(lines);
  console.log({highestX, highestY, lowestX, lowestY});
  simulateSpill(board);
  
  const filterdBoard = board.filter((_, index) => inRange(index, lowestY, highestY + 1));
  
  const str = board.map(row => row.filter((_, index) => inRange(index, lowestX, highestX + 3)).join('')).join('\n');
  writeFileSync('./out.txt', str, 'utf-8');
  
  const countTask1 = sum(filterdBoard, row => sum(row, tile => wetTiles.includes(tile) ? 1 : 0));
  const countTask2 = sum(filterdBoard, row => sum(row, tile => tile === TileType.WATER ? 1 : 0));
  return {countTask1, countTask2};
}