import * as fs from 'fs';
import * as path from 'path';
import {doChecksum, findSimilarWords, findSimilarChars} from './index';

const readFile = (filename: string): string[] => 
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('\n');

const day2_1 = () => {
  const input = readFile('./input');
  console.log('result', doChecksum(input));
}

const day2_2 = () => {
  const input = readFile('./input');
  console.log('result', findSimilarChars(input));
}


day2_2();