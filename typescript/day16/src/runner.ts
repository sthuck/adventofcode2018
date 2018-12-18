import * as fs from 'fs';
import * as path from 'path';
import {parse, howManyActionsMatch, task2, task1} from './index';

const readFile = (filename: string): string[] =>
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('\n');

const day16_1 = () => {
  console.log(task1(readFile('input')));

}

const day16_2 = () => {
  console.log(task2(readFile('input'), readFile('input-part2')));
}

day16_2();