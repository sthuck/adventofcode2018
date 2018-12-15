import {expect} from 'chai';
import {bfs, parse, allFreeTilesAround, readingOrder, playGame, task2} from './index';
import {flatten} from 'lodash';

describe('day15', () => {
  it('allFreeTilesAround', () => {

    const input = `#######
#E..G.#
#...#.#
#.G.#G#
#######`.split('\n');
    const {board, goblins, elves} = parse(input);
    const tiles = flatten(goblins.map(g => allFreeTilesAround(g, board)));
    expect(tiles.length).equal(6);
  });
  it('bfs', () => {

    const input = `#######
#E..G.#
#...#.#
#.G.#G#
#######`.split('\n');
    const {board, goblins, elves} = parse(input);
    const possibleTiles = flatten(goblins.map(g => allFreeTilesAround(g, board)));
    console.log((bfs(elves[0], possibleTiles, board)));
    expect(bfs(elves[0], possibleTiles, board)!.targetTile).to.contain({x: 3, y: 1});
  });
  it('bfs2', () => {

    const input = `#######
#E....#
#...#.#
#.G.#G#
#######`.split('\n');
    const {board, goblins, elves} = parse(input);
    const possibleTiles = flatten(goblins.map(g => allFreeTilesAround(g, board)));
    expect(bfs(elves[0], possibleTiles, board)!.targetTile).to.contain({x: 2, y: 2});
  });

  it('reading order', () => {
    const arr = [{x: 4, y: 10}, {x: 1, y: 1}, {x: 1, y: 10}];
    arr.sort(readingOrder);
    expect(arr).to.deep.equal([{x: 1, y: 1}, {x: 1, y: 10}, {x: 4, y: 10}])
  });

  it('example1', () => {
    const input = `
#######
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#
#######`.trim().split('\n');
    expect(playGame(input)).to.equal(27730);
  })
  it('example2', () => {
    const input = `
#######
#G..#E#
#E#E.E#
#G.##.#
#...#E#
#...E.#
#######`.trim().split('\n');
    expect(playGame(input)).to.equal(36334);
  })
  it('example3', () => {
    const input = `
#######
#E..EG#
#.#G.E#
#E.##E#
#G..#.#
#..E#.#
#######`.trim().split('\n');
    expect(playGame(input)).to.equal(39514);
  })
});

describe('task2', () => {
  it('example1', () => {
    const input = `
#######
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#
#######`.trim().split('\n');
    expect(task2(input)).to.equal(4988);
  });
});