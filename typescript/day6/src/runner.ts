import * as fs from 'fs';
import * as path from 'path';
import {parse, computeTask1, computeTask2} from './index';

const readFile = (filename: string): string[] => 
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('\n');

const day6_1 = () => {
  const lines = readFile('input');
  const points = parse(lines);
  console.log(computeTask1(points));

}

const day6_2 = () => {
  const lines = readFile('input');
  console.log(computeTask2(parse(lines), 10000));
}


day6_2();