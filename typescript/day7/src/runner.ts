import * as fs from 'fs';
import * as path from 'path';
import {parse, task1, task2} from './index';

const readFile = (filename: string): string[] =>
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('\n');

const day7_1 = () => {
  const lines = readFile('input');
  console.log(task1(parse(lines)));
}

const day7_2 = () => {
  const lines = readFile('input');
  console.log(task2(parse(lines), 60, 5));

}


day7_2();