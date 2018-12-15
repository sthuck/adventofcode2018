import * as fs from 'fs';
import * as path from 'path';
import {playGame, task2} from './index';

const readFile = (filename: string): string[] =>
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('\n');

const day15_1 = () => {
  console.log(playGame(readFile('input')));
}

const day15_2 = () => {
  console.log(task2(readFile('input')));
}

day15_2();