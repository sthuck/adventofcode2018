import * as fs from 'fs';
import * as path from 'path';
import {parse, sumMetadata, toNodes, specialSum} from './index';

const readFile = (filename: string): string =>
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');

const day8_1 = () => {
  const input = readFile('input');
  const numbers = parse(input)
  const {node} = toNodes(numbers, 0);
  console.log(sumMetadata(node));
}

const day8_2 = () => {
  const input = readFile('input');
  const numbers = parse(input)
  const {node} = toNodes(numbers, 0);
  console.log(specialSum(node));
}


day8_2();