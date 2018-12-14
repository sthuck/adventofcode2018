import * as fs from 'fs';
import * as path from 'path';
import {parse, playGame, playGameTask2} from './index';

const readFile = (filename: string): string =>
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');

const day13_1 = () => {
  const input = readFile('input').split('\n');
  const {board, carts} = parse(input);
  console.log(playGame(board, carts));
}

const day13_2 = () => {
  const input = readFile('input').split('\n');
  const {board, carts} = parse(input);
  console.log(playGameTask2(board, carts));
}

day13_2();