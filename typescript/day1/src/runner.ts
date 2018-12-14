import * as fs from 'fs';
import * as path from 'path';
import {applyFrequencies, findDuplicateFreq} from './index';

const readFile = (filename: string): string[] => 
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('\n');

const day1_1 = () => {
  const input = readFile('./input-1');
  const result = applyFrequencies(0, input);
  console.log('result', result);
}

const day1_2 = () => {
  const input = readFile('./input-1');
  const result = findDuplicateFreq(0, input);
  console.log('result', result);
}

day1_2();