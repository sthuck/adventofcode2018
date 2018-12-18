import {expect} from 'chai';
import {parseLine, findFillWidth, createBoard, Board, fillUp, simulateSpill, task1AndTask2} from './index';
import {inRange} from 'lodash';

const demoInput = `
x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504`.trim().split('\n');

const drawDemoBoard = (board: Board) =>
  board.map(row => row.filter((_, index) => inRange(index, 494, 508)).join('')).join('\n');

describe('day17', () => {
  it('parseLint', () => {
    expect(parseLine(demoInput[0])).to.deep.eq({xrange: {from: 495, to: 495}, yrange: {from: 2, to: 7}});
    expect(parseLine(demoInput[1])).to.deep.eq({xrange: {from: 495, to: 501}, yrange: {from: 7, to: 7}});
  })

  it.skip('createBoard', () => {
    const lines = demoInput.map(parseLine);
    const {board} = createBoard(lines);
    console.log(drawDemoBoard(board));
  });

  it('findClayWidth', () => {
    const lines = demoInput.map(parseLine);
    const {board} = createBoard(lines);
    expect(findFillWidth(board, {x: 499, y: 6})).to.deep.eq({from: 496, to: 500});
  })

  it('fillUp', () => {
    const lines = demoInput.map(parseLine);
    const {board} = createBoard(lines);
    fillUp(board, {x: 499, y: 6});
    const expected = `
..............
............#.
.#..#.......#.
.#..#~~#......
.#..#~~#......
.#~~~~~#......
.#~~~~~#......
.#######......
..............
..............
....#.....#...
....#.....#...
....#.....#...
....#######...`.trim();
    expect(drawDemoBoard(board)).to.eq(expected);
  });

  it('simulateSpill', () => {
    const lines = demoInput.map(parseLine);
    const {board} = createBoard(lines);
    simulateSpill(board);

    const expected = `
......|.......
......|.....#.
.#..#||||...#.
.#..#~~#|.....
.#..#~~#|.....
.#~~~~~#|.....
.#~~~~~#|.....
.#######|.....
........|.....
...|||||||||..
...|#~~~~~#|..
...|#~~~~~#|..
...|#~~~~~#|..
...|#######|..`.trim();
    expect(drawDemoBoard(board)).to.eq(expected);
  })

  it('task1', () => {
    expect(task1AndTask2(demoInput)).to.deep.eq({countTask2: 29, countTask1: 57});
  });
});
