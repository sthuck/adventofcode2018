import {range, uniqueId, max, isEqual, flatten, min} from 'lodash';
interface Point {
  x: number;
  y: number;
}
interface BaseTile extends Point {
}

interface Goblin extends BaseTile {
  type: TileType.GOBLIN,
  hp: number;
}

interface Elf extends BaseTile {
  type: TileType.ELF,
  hp: number;
}
interface Wall extends BaseTile {
  type: TileType.WALL
}
interface FreeTile extends BaseTile {
  type: TileType.FREE
}
enum TileType {
  FREE = '.',
  WALL = '#',
  GOBLIN = 'G',
  ELF = 'E',
}
type Tile = Goblin | Elf | Wall | FreeTile;
type Unit = Goblin | Elf;

type Board = Array<Array<Tile>>;
const [isWall, isElf, isGoblin, isFree] = [TileType.WALL, TileType.ELF, TileType.GOBLIN, TileType.FREE].map(type => (tile: Tile) => tile.type === type);

export const readingOrder = (p1: Point, p2: Point) => (p1.y - p2.y) || (p1.x - p2.x);

// UP, LEFT, RIGHT, DOWN - so BFS will have proper reading order;
const allTilesAround = ({x, y}: Tile, board: Board): Tile[] =>
  [{x, y: y - 1}, {x: x - 1, y}, {x: x + 1, y}, {x, y: y + 1}].map(({x, y}) => board[y][x]);

export const allFreeTilesAround = (tile: Tile, board: Board): Tile[] =>
  allTilesAround(tile, board)
    .filter(aroundTile => isFree(aroundTile))

export const bfs = (point: Point, targets: Point[], board: Board) => {
  if (targets.length === 0) {
    return;
  }

  const alreadyVisited = new Set<Tile>();
  const {x, y} = point;
  const initialTile = board[y][x];
  const toVisit: {parents: Tile[], tile: Tile}[] = [{parents: [], tile: initialTile}];

  while (toVisit.length > 0) {
    const {parents, tile} = toVisit.shift()!;
    if (alreadyVisited.has(tile)) {
      continue;
    }
    alreadyVisited.add(tile);

    const found = targets.find(({x, y}) => tile.x === x && tile.y === y);
    if (found) {
      return {track: parents.concat(tile), targetTile: tile};
    }

    allFreeTilesAround(tile, board)
      .filter(freeTile => !alreadyVisited.has(freeTile))
      .forEach(nextPossibleTile => toVisit.push({parents: [...parents, tile], tile: nextPossibleTile}));
  }
}

type Game = ReturnType<typeof parse> & {conf: {elfAttack: number, goblinAttack: number}};
export const parse = (input: string[]) => {
  const width = input[0].length;
  const height = input.length;
  const goblins: Goblin[] = [];
  const elves: Elf[] = [];
  const board: Board = range(height).map(y => range(width).map(x => {
    switch (input[y][x]) {
      case '#':
        return {type: TileType.WALL, x, y} as Wall;
      case '.':
        return {type: TileType.FREE, x, y} as FreeTile;
      case 'G':
        const goblin: Goblin = {type: TileType.GOBLIN, hp: 200, x, y};
        goblins.push(goblin);
        return goblin;
      case 'E':
        const elf: Elf = {type: TileType.ELF, hp: 200, x, y};
        elves.push(elf);
        return elf;
      default:
        throw new Error('Bad Parsing');
    }
  }));
  return {board, goblins, elves, iteration: 0};
}

const moveUnit = ({board}: Game, tile: Tile, toTile: Tile) => {
  const origin = {x: tile.x, y: tile.y};
  const dest = {x: toTile.x, y: toTile.y};
  Object.assign(tile, dest);
  board[origin.y][origin.x] = {type: TileType.FREE, ...origin};
  board[dest.y][dest.x] = tile;
}
const isDead = (unit: Unit) => unit.hp <= 0;

const attackUnit = (game: Game, p: Point) => {
  const unit: Unit = game.board[p.y][p.x] as Unit;
  const damage = unit.type === TileType.ELF ? game.conf.goblinAttack : game.conf.elfAttack;
  unit.hp -= damage;
  if (isDead(unit)) {
    const {x, y} = unit;
    game.board[y][x] = {type: TileType.FREE, x, y};
  }
}

const isEnemy = (unit: Unit, tile: Tile) => {
  if (unit.type === TileType.ELF) {
    return tile.type === TileType.GOBLIN;
  }
  return tile.type === TileType.ELF;
}

const hasEnemyNearby = (board: Board, unit: Unit) => {
  const nearTiles = allTilesAround(unit, board);
  const enemies: Unit[] = nearTiles.filter(nearTile => isEnemy(unit, nearTile)) as Unit[];
  const minimumHp = min(enemies.map(e => e.hp));
  const minimumHpEnemies = enemies.filter(e => e.hp === minimumHp).sort(readingOrder);
  if (minimumHpEnemies.length) {
    return minimumHpEnemies[0];
  }
  return undefined;
}

const getEnemies = (game: Game, unit: Unit): Unit[] => {
  if (unit.type === TileType.ELF) {
    return game.goblins.filter(g => !isDead(g));
  }
  return game.elves.filter(e => !isDead(e));
}


const tick = (game: Game, debug = true) => {

  if (debug) console.log(game.iteration);
  if (debug) drawGame(game);

  const units = ([] as Array<Elf | Goblin>).concat(game.elves).concat(game.goblins).sort(readingOrder);

  for (const unit of units) {
    if (isDead(unit)) {
      continue;
    }
    const enemyNearby = hasEnemyNearby(game.board, unit);
    if (enemyNearby) {
      attackUnit(game, enemyNearby);
    } else {
      /* move to closes enemy */
      const enemies = getEnemies(game, unit);
      if (enemies.length === 0) {
        return;
      }
      const possibleTiles = flatten(enemies.map(enemy => allFreeTilesAround(enemy, game.board)));
      const path = bfs(unit, possibleTiles, game.board);
      if (path) {
        if (path.track && path.track[1]) {
          moveUnit(game, unit, path.track[1]);
          const enemyNearby = hasEnemyNearby(game.board, unit); /* could be better, need to generalize move to cases where enemy is in range */
          if (enemyNearby) {
            attackUnit(game, enemyNearby);
          }
        }
      }
    }
  }
  game.iteration++;
}

const drawGame = (global as any).drawGame = (game: Game) => {
  const {board} = game;
  const lines = board.map(row => row.map(tile => tile.type).join('') + '\t');
  const units = ([] as Unit[]).concat(game.elves).concat(game.goblins).sort(readingOrder);
  units.filter(u => !isDead(u)).forEach(unit => lines[unit.y] += ` ${unit.type}(${unit.hp}) `);
  console.log(lines.join('\n'));
}

const hasGameEnded = (game: Game) => game.elves.every(isDead) || game.goblins.every(isDead);
const computeScore = (game: Game) => {
  const {board, elves, goblins, iteration} = game;
  let survivedUnits: Unit[] = (elves.every(isDead) ? goblins : elves);
  survivedUnits = survivedUnits.filter(unit => !isDead(unit));
  const sumHp = survivedUnits.reduce((sum, unit) => sum + unit.hp, 0);
  return sumHp * iteration;
}

export const playGame = (input: string[]) => {
  const game = {...parse(input), conf: {elfAttack: 3, goblinAttack: 3}};
  while (!hasGameEnded(game)) {
    tick(game, false);
  }
  return computeScore(game);
}

const task2GameFail = (game: Game) => game.elves.some(isDead);
const task2GameSuccess = (game: Game) => game.elves.every(elf => !isDead(elf)) && game.goblins.every(isDead);

export const task2 = (input: string[]) => {
  let elfAttack = 4;
  let ret = null;
  while (true) {
    const game = {...parse(input), conf: {elfAttack, goblinAttack: 3}};
    debugger;
    while (!task2GameFail(game) && !hasGameEnded(game)) {
      tick(game, false);
    }
    if (task2GameSuccess(game)) {
      ret = computeScore(game)
      break;
    }
    elfAttack++;
  }
  return ret;
}