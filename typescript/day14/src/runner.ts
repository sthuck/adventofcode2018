import * as fs from 'fs';
import * as path from 'path';
import {task2, task1} from './index';

const readFile = (filename: string): string =>
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');

const day14_1 = () => {
  console.log(task1(939601));
}

const day14_2 = () => {
  console.log(task2(939601));
}

day14_2();