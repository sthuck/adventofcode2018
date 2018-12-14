import {range, uniqueId, max} from 'lodash';

export class CyclicArray<T> {
  public array: T[];
  constructor() {
    this.array = [];
  }

  get(i: number) {
    return this.array[i % this.array.length];
  }

  push(item: T) {
    this.array.push(item);
  }
  pushAt(i: number, item: T) {
    const index = i > this.array.length ? i - this.array.length: i;
    this.array.splice(index, 0, item);
    return index;
  }

  removeAt(i: number) {
    const index = i < 0 ?  i + this.array.length: i;
    const item = this.array[index];
    this.array.splice(index, 1);
    return item;
  }

  fixIndex(i: number) {
    return i % this.array.length;
  }

  toString() {
    return this.array.toString();
  }
}

// export function game(players: number, lastMarbel: number, debug = false) {
//   let turn = 3;

//   const board = new CyclicArray<number>();
//   board.push(0);
//   board.push(2);
//   board.push(1);
//   let currentMarbleIndex = 1;
//   const playerScore: number[] = Array(players).fill(0);

//   while (turn !== lastMarbel + 1) {
//     if (turn % 23 !== 0) {
//       currentMarbleIndex = board.pushAt(currentMarbleIndex + 2, turn);
//     } else {
//       const removedMarble = board.removeAt(currentMarbleIndex - 7);
//       playerScore[(turn -1) % players] += turn + removedMarble;
//       currentMarbleIndex = currentMarbleIndex - 7;
//     }
//     if (debug) {
//       console.log(board.array.map((item, index) => index === currentMarbleIndex ? `(${item})` : ` ${item} `).join(''));
//     }
//     turn++;
//   }
//   if (debug) {
//     console.log(playerScore);
//   }
//   return max(playerScore);
// }

export function game(numPlayers: number, lastMarbel: number, debug = false) {
  const marbles = [0, 2, 1];
  const players = new Uint32Array(numPlayers);
  let marbleIndex = 1;
  players.fill(0);
  
  for (let i = 3; i <= lastMarbel; i++) {
    if (!(i % 10000)) console.log(i);
    if (i % 23) {
      marbleIndex += 2;
      if (marbleIndex > marbles.length) marbleIndex -= marbles.length;
      marbles.splice(marbleIndex, 0, i);
    } else {
      let removeIndex = marbleIndex - 7;
      if (removeIndex < 0) removeIndex += marbles.length;
      players[i % numPlayers] += i + marbles[removeIndex];
      marbles.splice(removeIndex, 1);
      marbleIndex = removeIndex;
    }
  }
  
  return Math.max(...players);
}