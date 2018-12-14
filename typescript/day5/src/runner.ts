import * as fs from 'fs';
import * as path from 'path';
import {doReaction, findBest} from './index';

const readFile = (filename: string): string => 
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');

const day5_1 = () => {
  const line = readFile('input');
  const newPolymer = doReaction(line);
  console.log(newPolymer.length);
}
const day5_2 = () => {
  const line = readFile('input');
  const bestLen = findBest(line);
  console.log(bestLen);
}


day5_2();