import * as fs from 'fs';
import * as path from 'path';
import {task1AndTask2} from './index';

const readFile = (filename: string): string[] =>
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('\n');

const day17_1 = () => {
  console.log(task1AndTask2(readFile('input')));
}

const day17_2 = () => {
}

day17_1();