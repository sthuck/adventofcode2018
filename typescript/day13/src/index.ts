import {range, uniqueId, max, isEqual} from 'lodash';
interface Position {
  x: number;
  y: number;
}

export enum Tracks {
  Vertical = '|',
  Horiz = '-',
  CurveLeft = '\\',
  CurveRight = '/',
  Intersection = '+'
}

export enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT
}

export enum CartsChar {
  RIGHT = '>',
  LEFT = '<',
  UP = '^',
  DOWN = 'v'
}

export const transformDirection = (current: Direction, turn: Direction): Direction => {
  return (current + turn) % 4;
}

export class Cart {
  public intersectionsTaken = 0;
  public id = uniqueId();
  constructor(public position: Position, public direction: Direction) {}

  move(direction: Direction = this.direction) {
    this.direction = direction;
    switch (direction) {
      case Direction.UP:
        this.position.y -= 1;
        break;
      case Direction.DOWN:
        this.position.y += 1;
        break;
      case Direction.LEFT:
        this.position.x -= 1;
        break;
      case Direction.RIGHT:
        this.position.x += 1;
        break;
      default:
        return;
    }
  }

  doIntersection() {
    const directions = [Direction.LEFT, Direction.UP, Direction.RIGHT];
    const nextTurnDirection = directions[this.intersectionsTaken % 3];
    const nextDirection = transformDirection(this.direction, nextTurnDirection);
    this.move(nextDirection);
    this.intersectionsTaken++;
  }
}
const error = () => {throw new Error('Bad Direction');}

const map: Record<Exclude<Tracks, Tracks.Intersection>, Record<Direction, () => Direction>> = {
  [Tracks.CurveLeft]: {
    [Direction.UP]: () => Direction.LEFT,
    [Direction.DOWN]: () => Direction.RIGHT,
    [Direction.LEFT]: () => Direction.UP,
    [Direction.RIGHT]: () => Direction.DOWN
  },
  [Tracks.CurveRight]: {
    [Direction.UP]: () => Direction.RIGHT,
    [Direction.DOWN]: () => Direction.LEFT,
    [Direction.LEFT]: () => Direction.DOWN,
    [Direction.RIGHT]: () => Direction.UP
  },
  [Tracks.Vertical]: {
    [Direction.UP]: () => Direction.UP,
    [Direction.DOWN]: () => Direction.DOWN,
    [Direction.LEFT]: () => error(),
    [Direction.RIGHT]: () => error()
  },
  [Tracks.Horiz]: {
    [Direction.LEFT]: () => Direction.LEFT,
    [Direction.RIGHT]: () => Direction.RIGHT,
    [Direction.UP]: () => error(),
    [Direction.DOWN]: () => error()
  }
}


const mapCartToTrack: Record<CartsChar, Direction> = {
  [CartsChar.RIGHT]: Direction.RIGHT,
  [CartsChar.LEFT]: Direction.LEFT,
  [CartsChar.UP]: Direction.UP,
  [CartsChar.DOWN]: Direction.DOWN,
}

const computeNextPos = (board: string[][], cart: Cart) => {
  const {x, y} = cart.position;
  const track = board[y][x] as Tracks;
  if (track === Tracks.Intersection) {
    cart.doIntersection();
  } else {
    const nextDirection = map[track][cart.direction]();
    cart.move(nextDirection);
  }
}

export const parse = (input: string[]) => {
  const height = input.length;
  const width = input[0].length;
  console.log('width', width, 'height', height);
  const carts: Cart[] = [];
  const board = range(height).map(y => range(width).map(x => {
    const char = input[y][x];
    switch (char) {
      case CartsChar.DOWN:
        carts.push(new Cart({x, y}, Direction.DOWN));
        return Tracks.Vertical;
      case CartsChar.UP:
        carts.push(new Cart({x, y}, Direction.UP));
        return Tracks.Vertical;
      case CartsChar.RIGHT:
        carts.push(new Cart({x, y}, Direction.RIGHT));
        return Tracks.Horiz;
      case CartsChar.LEFT:
        carts.push(new Cart({x, y}, Direction.LEFT));
        return Tracks.Horiz;
      default:
        return char;
    }
  }));
  return {board, carts};
}

export const sortPlayers = (carts: Cart[]) => {
  return carts.sort((a, b) => {
    return (a.position.y - b.position.y) || (a.position.x - b.position.x);
  })
}

export const DoWeHaveCollision = (carts: Cart[]) => {
  const positionSet = new Set<string>();
  let foundPosition: string = '';
  carts.map(cart => JSON.stringify(cart.position)).some(position => {
    if (positionSet.has(position)) {
      foundPosition = position;
      return true;
    }
    positionSet.add(position);
    return false;
  })
  if (foundPosition) {
    return JSON.parse(foundPosition) as Position;
  }
}


export const playGame = (board: string[][], carts: Cart[]) => {
  let collision: Position | undefined = undefined;
  while (!collision) {
    sortPlayers(carts);
    carts.some(cart => {
      computeNextPos(board, cart);
      collision = DoWeHaveCollision(carts);
      return !!collision;
    })
  }
  return collision;
}

export const playGameTask2 = (board: string[][], carts: Cart[]) => {
  while (carts.length > 1) {
    sortPlayers(carts);
    for (const cart of carts) {
      computeNextPos(board, cart);
      const collision = DoWeHaveCollision(carts);
      
      carts = carts.filter(c => !isEqual(c.position, collision));
    };
  }
  return carts[0].position;
}