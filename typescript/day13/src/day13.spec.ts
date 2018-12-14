import {expect} from 'chai';
import {escape} from 'lodash';
import {transformDirection, Direction, Tracks, sortPlayers, Cart, playGame, parse, playGameTask2} from './index';

describe('day13', () => {
  it('transformDirection', () => {
    expect(transformDirection(Direction.UP, Direction.LEFT)).equal(Direction.LEFT);
    expect(transformDirection(Direction.UP, Direction.RIGHT)).equal(Direction.RIGHT);
    expect(transformDirection(Direction.LEFT, Direction.UP)).equal(Direction.LEFT);
    expect(transformDirection(Direction.LEFT, Direction.RIGHT)).equal(Direction.UP);
    expect(transformDirection(Direction.LEFT, Direction.LEFT)).equal(Direction.DOWN);
  });

  it('sortPlayers', () => {
    const a = new Cart({x: 5, y: 3}, 0);
    const b = new Cart({x: 6, y: 1}, 0);
    const c = new Cart({x: 1, y: 1}, 0);
    const d = new Cart({x: 1, y: 4}, 0);
    expect(sortPlayers([a, b, c, d])).to.deep.equal([c, b, a, d]);
  });

  it('', () => {
    const input = String.raw`/->-\        
|   |  /----\
| /-+--+-\  |
| | |  | v  |
\-+-/  \-+--/
  \------/   `;
  const {board, carts} = parse(input.split('\n')); 
  const collision = playGame(board, carts);
  expect(collision).to.deep.equal({x: 7, y: 3});
  });

  it('task2', () => {
    const input = String.raw`/>-<\  
|   |  
| /<+-\
| | | v
\>+</ |
  |   ^
  \<->/`;
      const {board, carts} = parse(input.split('\n')); 
      const position = playGameTask2(board, carts);
      expect(position).to.deep.equal({x: 6, y: 4});
  });
});